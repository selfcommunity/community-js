import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {TextField, Typography, Box, Avatar, Button, CardContent, Alert, FormGroup, AvatarGroup, List, ListItem} from '@mui/material';
import {SCIncubatorType, SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  Link,
  SCContextType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCFetchIncubator,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import BaseDialog from '../../shared/BaseDialog';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Incubator, {IncubatorProps} from '../Incubator';
import Widget from '../Widget';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import User from '../User';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Icon from '@mui/material/Icon';
import {FACEBOOK_SHARE, TWITTER_SHARE, LINKEDIN_SHARE} from '../../constants/SocialShare';

const messages = defineMessages({
  intro: {
    id: 'ui.incubatorDetail.intro',
    defaultMessage: 'ui.incubatorDetail.intro'
  }
});

const PREFIX = 'SCIncubatorDetail';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  title: `${PREFIX}-title`,
  author: `${PREFIX}-author`,
  shareCard: `${PREFIX}-share-card`,
  copyUrlForm: `${PREFIX}-copy-url-form`,
  copyButton: `${PREFIX}-copy-button`,
  copyText: `${PREFIX}-copy-text`,
  shareSection: `${PREFIX}-share-section`,
  socialShareButton: `${PREFIX}-social-share-button`,
  subscribers: `${PREFIX}-subscribers`,
  shareMenuIcon: `${PREFIX}-share-Menu-icon`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  ' & .MuiCardContent-root': {
    '&:last-child': {
      paddingBottom: 0
    }
  },
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  [`& .${classes.avatar}`]: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(3)
  },
  [`& .${classes.title}`]: {
    fontSize: '1rem',
    whiteSpace: 'pre-line'
  },
  [`& .${classes.copyUrlForm}`]: {
    flexDirection: 'row',
    marginBottom: theme.spacing(1)
  },
  [`& .${classes.copyButton}`]: {
    borderRadius: 0
  },
  [`& .${classes.copyText}`]: {
    width: '80%',
    '& .MuiInputBase-root': {
      borderRadius: 0,
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1)
      }
    }
  },
  [`& .${classes.shareSection}`]: {
    display: 'flex',
    gap: theme.spacing(),
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(3)
  },
  [`& .${classes.socialShareButton}`]: {
    marginRight: theme.spacing()
  },
  [`& .${classes.subscribers}`]: {
    marginTop: theme.spacing(),
    '& .MuiAvatar-root': {
      color: theme.palette.common.white,
      border: '2px solid #FFF'
    }
  }
}));

export interface IncubatorDetailProps {
  /**
   * Incubator Object
   * @default null
   */
  incubator?: SCIncubatorType;
  /**
   * Id of scIncubator object
   * @default null
   */
  incubatorId?: number;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * Props to spread to single scIncubator object
   * @default {}
   */
  IncubatorProps?: IncubatorProps;
  /**
   * Callback fired on subscribe action to update count in main list
   * @param scIncubator
   */
  onSubscriptionsUpdate?: (scIncubator) => any;
}
/**
 * > API documentation for the Community-JS Incubator Detail component. Learn about the available props and the CSS API.

 #### Import
 ```jsx
 import {IncubatorDetail} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCIncubatorDetail` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorDetail-root|Styles applied to the root element.|
 |avatar|.SCIncubatorDetail-avatar|Styles applied to the avatar element.|
 |title|.SCIncubatorDetail-title|Styles applied to the title element.|
 |author|.SCIncubatorDetail-author|Styles applied to the author element.|
 |shareCard|.SCIncubatorDetail-share-card|Styles applied to the  section card.|
 |copyUrlForm|.SCIncubatorDetail-copy-url-form|Styles applied to the url copy section.|
 |copyButton|.SCIncubatorDetail-copy-button|Styles applied to the copy button element.|
 |copyText|.SCIncubatorDetail-copy-text|Styles applied to the text copy element.|
 |shareSection|.SCIncubatorDetail-share-section|Styles applied to the social share section.|
 |socialShareButton|.SCIncubatorDetail-social-share-button|Styles applied to the social share button.|
 |subscribers|.SCIncubatorDetail-subscribers|Styles applied to the subscribers avatar section.|
* @param inProps
*/
export default function IncubatorDetail(inProps: IncubatorDetailProps): JSX.Element {
  // PROPS
  const props: IncubatorDetailProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {incubator, incubatorId, className, open, onClose, IncubatorProps = {}, onSubscriptionsUpdate, ...rest} = props;

  // STATE
  const [alert, setAlert] = useState<boolean>(false);
  const {scIncubator, setSCIncubator} = useSCFetchIncubator({id: incubator.id, incubator});
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(
    incubator.id || scIncubator ? `${Endpoints.GetIncubatorSubscribers.url({id: incubator ? incubator.id : scIncubator.id})}?limit=10` : null
  );
  const [total, setTotal] = useState<number>(0);
  const [subscribers, setSubscribers] = useState<SCUserType[]>([]);
  const [openSubscribersDialog, setOpenSubscribersDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
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
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const portal = scContext.settings.portal + scRoutingContext.url(SCRoutes.INCUBATOR_ROUTE_NAME, scIncubator);
  const isSocialShareEnabled = facebookShareEnabled || twitterShareEnabled || linkedinShareEnabled;

  // INTL
  const intl = useIntl();

  // HANDLERS

  /**
   * Copies incubator path on clipboard and notifies user
   */
  const copy = async () => {
    await navigator.clipboard.writeText(portal);
    setAlert(true);
  };

  /**
   * Opens subscribers dialog
   */
  function handleToggleSubscribersDialog() {
    setOpenSubscribersDialog((prev) => !prev);
  }

  /**
   * Handles incubator subscribe/unsubscribe callback
   */
  function handleSubscribersUpdate(incubator, subscribed) {
    let _subscribers = [];
    if (subscribed) {
      _subscribers = [...[scUserContext.user], ...subscribers];
    } else {
      if (total < 5) {
        _subscribers = [...subscribers.filter((u) => u.id !== scUserContext.user.id)];
      } else {
        const _pSubscribers = subscribers.slice(0, 5).filter((u) => u.id !== scUserContext.user.id);
        _subscribers = [..._pSubscribers, ...subscribers.slice(5)];
      }
    }
    setTotal((prev) => prev + (subscribed ? 1 : -1));
    setSubscribers(_subscribers);
    setNext(null);
  }

  /**
   * Handles subscription counter and subscribers update callbacks on subscribe/unsubscribe action
   */
  const handleUpdates = (incubator, subscribed) => {
    onSubscriptionsUpdate(incubator);
    handleSubscribersUpdate(incubator, subscribed);
  };

  /**
   * If id attempts to get the incubator by id
   */
  useEffect(() => {
    if (scIncubator) {
      fetchSubscribers();
    }
  }, [scIncubator]);

  /**
   * Fetches incubator subscribers
   */
  const fetchSubscribers = useMemo(
    () => () => {
      if (next) {
        http
          .request({
            url: next,
            method: Endpoints.GetIncubatorSubscribers.method
          })
          .then((res: HttpResponse<any>) => {
            if (res.status < 300) {
              setSubscribers([...subscribers, ...res.data.results]);
              setTotal(res.data['count']);
              setNext(res.data['next']);
              setLoading(false);
            }
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [scIncubator, next, loading]
  );

  /**
   * If not incubator object returns null
   */
  if (!scIncubator) {
    return null;
  }

  /**
   * Renders root element
   */
  return (
    <Root
      title={
        <>
          <Avatar className={classes.avatar} alt={scIncubator.user.avatar} src={scIncubator.user.avatar} />
          <Box>
            <Typography className={classes.title}>{`${intl.formatMessage(messages.intro, {name: scIncubator.name})}`} </Typography>
            <Typography component={'span'}>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scIncubator.user)}>@{scIncubator.user.username}</Link>
            </Typography>
          </Box>
        </>
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <Box>
        <Incubator elevation={0} incubator={scIncubator} detailView={true} subscribeButtonProps={{onSubscribe: handleUpdates}} {...IncubatorProps} />
        <Box className={classes.subscribers}>
          {loading && !scIncubator ? (
            <AvatarGroupSkeleton {...rest} />
          ) : (
            <>
              {total > 0 ? (
                <Button onClick={handleToggleSubscribersDialog} disabled={loading || !scIncubator}>
                  <AvatarGroup {...rest}>
                    {subscribers.map((u: SCUserType) => (
                      <Avatar key={u.id} alt={u.username} src={u.avatar} />
                    ))}
                    {[...Array(Math.max(0, total - subscribers.length))].map(
                      (
                        x,
                        i // Add max to 0 to prevent creation of array with negative index during state update
                      ) => (
                        <Avatar key={i} />
                      )
                    )}
                  </AvatarGroup>
                </Button>
              ) : null}
            </>
          )}
        </Box>
        {openSubscribersDialog && (
          <BaseDialog
            title={
              <>
                <FormattedMessage defaultMessage="ui.incubatorDetail.subscribersSection.title" id="ui.incubatorDetail.subscribersSection.title" /> (
                {total})
              </>
            }
            onClose={handleToggleSubscribersDialog}
            open={openSubscribersDialog}>
            {loading ? (
              <CentralProgress size={50} />
            ) : (
              <InfiniteScroll
                dataLength={total}
                next={fetchSubscribers}
                hasMoreNext={next !== null}
                loaderNext={<CentralProgress size={30} />}
                height={400}
                endMessage={
                  <Typography variant="body2" align="center" fontWeight="bold">
                    <FormattedMessage
                      id="ui.incubatorDetail.subscribersSection.noMoreSubscribers"
                      defaultMessage="ui.incubatorDetail.subscribersSection.noMoreSubscribers"
                    />
                  </Typography>
                }>
                <List>
                  {subscribers.map((s, index) => (
                    <ListItem key={(s.id, index)}>
                      <User elevation={0} user={s} key={index} />
                    </ListItem>
                  ))}
                </List>
              </InfiniteScroll>
            )}
          </BaseDialog>
        )}
        <Widget elevation={1} className={classes.shareCard}>
          <CardContent>
            <Typography variant={'h6'}>
              <FormattedMessage id="ui.incubatorDetail.shareSection.title" defaultMessage="ui.incubatorDetail.shareSection.title" />
            </Typography>
            <Typography variant={'subtitle1'}>
              <FormattedMessage id="ui.incubatorDetail.shareSection.share" defaultMessage="ui.incubatorDetail.shareSection.share" />
            </Typography>
            <FormGroup className={classes.copyUrlForm}>
              <TextField className={classes.copyText} variant="outlined" value={portal} />
              <Button className={classes.copyButton} variant="contained" onClick={copy}>
                <FormattedMessage id="ui.incubatorDetail.shareSection.button.copy" defaultMessage="ui.incubatorDetail.shareSection.button.copy" />
              </Button>
            </FormGroup>
            {alert && (
              <Alert onClose={() => setAlert(false)}>
                <FormattedMessage id="ui.incubatorDetail.shareSection.copied" defaultMessage="ui.incubatorDetail.shareSection.copied" />
              </Alert>
            )}
            {isSocialShareEnabled && (
              <Typography variant={'subtitle2'}>
                <FormattedMessage id="ui.incubatorDetail.shareSection.invite" defaultMessage="ui.incubatorDetail.shareSection.invite" />
              </Typography>
            )}
            <Box className={classes.shareSection}>
              {facebookShareEnabled && (
                <Icon
                  classes={{root: classes.shareMenuIcon}}
                  fontSize="small"
                  onClick={() => window.open(FACEBOOK_SHARE + portal, 'facebook-share-dialog', 'width=626,height=436')}>
                  facebook
                </Icon>
              )}
              {twitterShareEnabled && (
                <Icon
                  classes={{root: classes.shareMenuIcon}}
                  fontSize="small"
                  onClick={() => window.open(TWITTER_SHARE + portal, 'twitter-share-dialog', 'width=626,height=436')}>
                  twitter
                </Icon>
              )}
              {linkedinShareEnabled && (
                <Icon
                  classes={{root: classes.shareMenuIcon}}
                  fontSize="small"
                  onClick={() => window.open(LINKEDIN_SHARE + portal, 'linkedin-share-dialog', 'width=626,height=436')}>
                  linkedin
                </Icon>
              )}
            </Box>
          </CardContent>
        </Widget>
      </Box>
    </Root>
  );
}
