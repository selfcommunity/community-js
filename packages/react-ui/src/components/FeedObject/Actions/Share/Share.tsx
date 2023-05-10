import React, {useContext, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Icon from '@mui/material/Icon';
import LoadingButton from '@mui/lab/LoadingButton';
import SharesDialog from './SharesDialog';
import {styled} from '@mui/material/styles';
import {Box, Button, Divider, ListItemText, Menu, SwipeableDrawer, Tooltip, useMediaQuery, useTheme} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Composer from '../../../Composer';
import {MEDIA_TYPE_SHARE} from '../../../../constants/Media';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import classNames from 'classnames';
import {useSnackbar} from 'notistack';
import Skeleton from '@mui/material/Skeleton';
import {SCContributionType, SCFeedObjectType, SCMediaType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchFeedObject,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import {getContributionRouteName, getRouteData} from '../../../../utils/contribution';
import {FACEBOOK_SHARE, LINKEDIN_SHARE, TWITTER_SHARE} from '../../../../constants/SocialShare';

const messages = defineMessages({
  shares: {
    id: 'ui.feedObject.share.shares',
    defaultMessage: 'ui.feedObject.share.shares'
  },
  share: {
    id: 'ui.feedObject.share.share',
    defaultMessage: 'ui.feedObject.share.share'
  },
  shareInCategories: {
    id: 'ui.feedObject.share.shareInCategories',
    defaultMessage: 'ui.feedObject.share.shareInCategories'
  }
});

const PREFIX = 'SCShareAction';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  inline: `${PREFIX}-inline`,
  button: `${PREFIX}-button`,
  viewAudienceButton: `${PREFIX}-view-audience-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ShareProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Show audience
   * @default true
   */
  withAudience?: boolean;

  /**
   * Show action
   * @default true
   */
  withAction?: boolean;

  /**
   * Inline action layout.
   * Action will be align with the audience button.
   * @default true
   */
  inlineAction?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Share(inProps: ShareProps): JSX.Element {
  // PROPS
  const props: ShareProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCContributionType.POST,
    withAction = true,
    withAudience = true,
    inlineAction = false,
    ...rest
  } = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerShareProps, setComposerShareProps] = useState<any>(null);
  const [openSharesDialog, setOpenSharesDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const facebookShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED].value;
  const twitterShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_TWITTER_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_TWITTER_ENABLED].value;
  const linkedinShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED].value;
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();
  const domain = typeof location !== 'undefined' && location.origin ? location.origin : '';
  const url = domain + scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj));

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleOpenShareMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Open/Close dialog shares
   */
  function handleToggleSharesDialog() {
    setOpenSharesDialog(!openSharesDialog);
  }

  /**
   * Handles Composer onClose
   */
  function handleComposerOnClose() {
    setIsSharing(false);
    setIsComposerOpen(false);
  }

  /**
   * Handles Composer onSuccess
   */
  function handleComposerOnSuccess() {
    setObj(Object.assign({}, obj, {share_count: obj.share_count + 1}));
    handleComposerOnClose();
  }

  /**
   * Performs follow/unfollow
   * Post, Discussion, Status
   */
  const performCreateMediaShare = useMemo(
    () => () => {
      // Define share object id
      let sharedObjectId: number = obj.id;
      // Avoid to re-share an object with a shared_object in medias
      const shareMedias: SCMediaType[] = obj.medias.filter((media) => media.type === MEDIA_TYPE_SHARE);
      if (shareMedias.length) {
        sharedObjectId = shareMedias[0].embed.metadata.id;
      }
      return http
        .request({
          url: Endpoints.ComposerMediaCreate.url(),
          method: Endpoints.ComposerMediaCreate.method,
          data: {
            type: MEDIA_TYPE_SHARE,
            shared_object: sharedObjectId
          }
        })
        .then((res: HttpResponse<SCMediaType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Performs the contribute sharing
   */
  function share(inCategories) {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        setIsSharing(true);
        performCreateMediaShare()
          .then((data: SCMediaType) => {
            setComposerShareProps({medias: [data], ...(inCategories ? {categories: obj.categories} : {})});
            setIsComposerOpen(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            setIsSharing(false);
          });
      }
    }
  }

  /**
   * Renders audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const sharesCount = obj.share_count;
    let audience;
    if (withAudience) {
      if (!obj) {
        audience = (
          <Button variant="text" size="small" disabled color="inherit">
            <Skeleton animation="wave" height={18} width={50} />
          </Button>
        );
      } else {
        audience = (
          <>
            <Button
              variant="text"
              size="small"
              onClick={handleToggleSharesDialog}
              disabled={sharesCount < 1}
              classes={{root: classes.viewAudienceButton}}>
              {`${intl.formatMessage(messages.shares, {total: sharesCount})}`}
            </Button>
            {openSharesDialog && sharesCount > 0 && (
              <SharesDialog feedObject={obj} feedObjectType={obj.type} open={openSharesDialog} onClose={handleToggleSharesDialog} />
            )}
          </>
        );
      }
    }
    return audience;
  }

  function renderShareMenuItems() {
    return (
      <Box>
        <MenuItem onClick={() => share(false)}>
          <ListItemIcon>
            <Icon fontSize="small">redo</Icon>
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="ui.feedObject.share.shareNow" defaultMessage="ui.feedObject.share.shareNow" />} />
        </MenuItem>
        {obj.categories.length > 0 && (
          <MenuItem onClick={() => share(true)}>
            <ListItemIcon>
              <Icon fontSize="small">share</Icon>
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage(messages.shareInCategories, {categories: obj.categories.map((c) => c.name).join(', ')})} />
          </MenuItem>
        )}
        {facebookShareEnabled && (
          <MenuItem onClick={() => window.open(FACEBOOK_SHARE + url, 'facebook-share-dialog', 'width=626,height=436')}>
            <ListItemIcon>
              <Icon fontSize="small">facebook</Icon>
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="ui.feedObject.share.facebook" defaultMessage="ui.feedObject.share.facebook" />} />
          </MenuItem>
        )}
        {twitterShareEnabled && (
          <MenuItem onClick={() => window.open(TWITTER_SHARE + url, 'twitter-share-dialog', 'width=626,height=436')}>
            <ListItemIcon>
              <Icon fontSize="small">twitter</Icon>
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="ui.feedObject.share.twitter" defaultMessage="ui.feedObject.share.twitter" />} />
          </MenuItem>
        )}
        {linkedinShareEnabled && (
          <MenuItem onClick={() => window.open(LINKEDIN_SHARE + url, 'linkedin-share-dialog', 'width=626,height=436')}>
            <ListItemIcon>
              <Icon fontSize="small">linkedin</Icon>
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="ui.feedObject.share.linkedin" defaultMessage="ui.feedObject.share.linkedin" />} />
          </MenuItem>
        )}
      </Box>
    );
  }

  /**
   * Renders vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderShareBtn() {
    return (
      <React.Fragment>
        {withAction && (
          <React.Fragment>
            {!inlineAction && withAudience && <Divider className={classes.divider} />}
            <Tooltip title={`${intl.formatMessage(messages.share)}`}>
              <LoadingButton loading={isSharing} onClick={handleOpenShareMenu} className={classes.button}>
                <Icon>share</Icon>
              </LoadingButton>
            </Tooltip>
            <>
              {!isMobile ? (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0
                      }
                    }
                  }}
                  transformOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
                  {renderShareMenuItems()}
                </Menu>
              ) : (
                <SwipeableDrawer open={Boolean(anchorEl)} onClose={handleClose} onOpen={handleOpenShareMenu} anchor="bottom" disableSwipeToOpen>
                  {renderShareMenuItems()}
                </SwipeableDrawer>
              )}
            </>
            {isComposerOpen && (
              <Composer
                open={isComposerOpen}
                defaultValue={composerShareProps}
                onClose={handleComposerOnClose}
                onSuccess={handleComposerOnSuccess}
                maxWidth="sm"
                fullWidth
                scroll="body"
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders share action
   */
  return (
    <Root className={classNames(classes.root, className, {[classes.inline]: inlineAction})} {...rest}>
      {renderAudience()}
      {renderShareBtn()}
    </Root>
  );
}
