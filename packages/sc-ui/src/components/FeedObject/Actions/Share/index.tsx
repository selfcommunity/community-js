import React, {useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import SharesDialog from './SharesDialog';
import {
  Endpoints,
  http,
  Logger,
  SCFeedDiscussionType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCFeedPostType,
  SCFeedStatusType,
  SCMediaType,
  SCTagType,
  useSCFetchFeedObject
} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import ShareMenuIcon from '@mui/icons-material/RedoOutlined';
import ShareMenuInCategoriesIcon from '@mui/icons-material/ShareOutlined';
import {Box, Button, Divider, IconButton, ListItemText, Menu, Tooltip, Typography} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Composer from '../../../Composer';
import {AxiosResponse} from 'axios';
import {MEDIA_TYPE_SHARE} from '../../../../constants/Media';
import {SCOPE_SC_UI} from '../../../../constants/Errors';

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

const PREFIX = 'SCShareObject';

const classes = {
  shareMenuIcon: `${PREFIX}-share-Menu-icon`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.shareMenuIcon}`]: {
    minWidth: 30
  }
}));

export default function Share({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  withAction = false,
  inlineAction = true,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  withAction: boolean;
  inlineAction: boolean;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerShareProps, setComposerShareProps] = useState<any>(null);
  const [openSharesDialog, setOpenSharesDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const intl = useIntl();

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
   * Handle Composer onClose
   */
  function handleComposerOnClose() {
    setIsSharing(false);
    setIsComposerOpen(false);
  }

  /**
   * Handle Composer onSuccess
   */
  function handleComposerOnSuccess(shareObj) {
    handleComposerOnClose();
    console.log('Object shared');
    console.log(shareObj);
  }

  /**
   * Perform follow/unfollow
   * Post, Discussion, Status
   */
  const performCreateMediaShare = useMemo(
    () => () => {
      // Define share object id
      let sharedObjectId: number = obj.id;
      // Avoid to re-share an object with a shared_object in medias
      const shareMedias: SCMediaType[] = obj.medias.filter((media) => media.type === MEDIA_TYPE_SHARE);
      if (shareMedias.length) {
        sharedObjectId = shareMedias[0].embed.id;
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
        .then((res: AxiosResponse<SCMediaType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Perform share contribute
   */
  function share(inCategories) {
    setIsSharing(true);
    performCreateMediaShare()
      .then((data: SCMediaType) => {
        console.log(data);
        setComposerShareProps({medias: [data], ...(inCategories ? {categories: obj.categories} : {})});
        setIsComposerOpen(true);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setIsSharing(false);
      });
  }

  /**
   * Render inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  function renderInlineStartShareBtn() {
    if (withAction && inlineAction) {
      return (
        <Tooltip title={isSharing ? '' : 'Share'}>
          <span>
            <IconButton disabled={isSharing} onClick={share} edge={isSharing ? false : 'end'} size="large">
              {isSharing ? (
                <Box style={{padding: 10}}>
                  <CircularProgress size={14} style={{marginTop: -2}} />
                </Box>
              ) : (
                <React.Fragment>
                  <ShareIcon fontSize="small" />
                </React.Fragment>
              )}
            </IconButton>
          </span>
        </Tooltip>
      );
    }
    return null;
  }

  /**
   * Render audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const sharesCount = obj.share_count;
    return (
      <Box>
        {renderInlineStartShareBtn()}
        <Button variant="text" size="small" onClick={handleToggleSharesDialog} disabled={sharesCount < 1} sx={{height: 32}}>
          <Typography variant={'body2'}>
            <React.Fragment>{`${intl.formatMessage(messages.shares, {total: sharesCount})}`}</React.Fragment>
          </Typography>
        </Button>
        {openSharesDialog && sharesCount > 0 && <SharesDialog object={obj} open={openSharesDialog} onClose={handleToggleSharesDialog} />}
      </Box>
    );
  }

  /**
   * Render vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderShareBtn() {
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider />
            <Tooltip title={`${intl.formatMessage(messages.share)}`}>
              <LoadingButton loading={isSharing} onClick={handleOpenShareMenu}>
                <ShareIcon fontSize={'large'} />
              </LoadingButton>
            </Tooltip>
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
              <MenuItem onClick={() => share(false)}>
                <ListItemIcon classes={{root: classes.shareMenuIcon}}>
                  <ShareMenuIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={<FormattedMessage id="ui.feedObject.share.shareNow" defaultMessage="ui.feedObject.share.shareNow" />} />
              </MenuItem>
              {obj.categories.length > 0 && (
                <MenuItem onClick={() => share(true)}>
                  <ListItemIcon classes={{root: classes.shareMenuIcon}}>
                    <ShareMenuInCategoriesIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(messages.shareInCategories, {categories: obj.categories.map((c) => c.name).join(', ')})}
                  />
                </MenuItem>
              )}
            </Menu>
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

  return (
    <Root {...rest}>
      {renderAudience()}
      {renderShareBtn()}
    </Root>
  );
}
