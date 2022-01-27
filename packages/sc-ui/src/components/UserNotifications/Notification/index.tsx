import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';

import CardContent from '@mui/material/CardContent';
import UserNotificationComment from './Comment';
import UserFollowNotification from './UserFollow';
import UndeletedForNotification from './UndeletedFor';
import DeletedForNotification from './DeletedFor';
import UserConnectionNotification from './UserConnection';
import UserNotificationPrivateMessage from './PrivateMessage';
import UserBlockedNotification from './UserBlocked';
import UserNotificationMention from './Mention';
import CollapsedForNotification from './CollapsedFor';
import KindlyNoticeForNotification from './KindlyNoticeFor';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {grey} from '@mui/material/colors';
import KindlyNoticeFlagNotification from './KindlyNoticeFlag';
import VoteUpNotification from './VoteUp';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import NotificationsOnOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {AxiosResponse} from 'axios';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {getContribute} from '../../../utils/contribute';
import ContributionFollowNotification from './ContributionFollow';
import {Avatar, Button, Card, CardProps, Collapse, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography} from '@mui/material';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCCommentType,
  SCCommentTypologyType,
  SCNotificationAggregatedType,
  SCNotificationPrivateMessageType,
  SCNotificationType,
  SCNotificationTypologyType,
  SCRoutes,
  SCRoutingContextType,
  useSCRouting
} from '@selfcommunity/core';

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.userNotifications.receivePrivateMessage',
    defaultMessage: 'ui.userNotifications.receivePrivateMessage'
  }
});

const PREFIX = 'SCUserNotification';

const classes = {
  title: `${PREFIX}-title`,
  stopNotificationButton: `${PREFIX}-stop-notification-button`,
  showOtherAggregated: `${PREFIX}-show-other-aggregated`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  [`& .${classes.title}`]: {
    fontWeight: 600,
    color: grey[800],
    fontSize: 15,
    padding: '10px 8px 2px 8px',
    textDecoration: 'underline'
  },
  ['& .MuiCardContent-root']: {
    padding: 0
  },
  [`& .${classes.stopNotificationButton}`]: {
    margin: '5px 10px',
    padding: '2px 2px 2px 2px',
    minWidth: 'auto'
  },
  [`& .${classes.showOtherAggregated}`]: {
    backgroundColor: grey[100]
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
  }
}));

export interface UserNotificationProps extends CardProps {
  /**
   * Id of the UserNotification
   * @default 'notification_<notificationObject.sid>'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationAggregatedType;

  /**
   * The max n of results shown
   * @default 2
   */
  showMaxAggregated?: number;

  /**
   * The obj key
   */
  key: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function UserNotification(props: UserNotificationProps): JSX.Element {
  // PROPS
  const {id = `notification_${props.notificationObject.sid}`, className = null, notificationObject = null, showMaxAggregated = 2, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [obj, setObj] = useState<SCNotificationAggregatedType>(notificationObject);
  const [loadingVote, setLoadingVote] = useState<number>(null);
  const [loadingSuspendNotification, setLoadingSuspendNotification] = useState<boolean>(false);
  const [openOtherAggregated, setOpenOtherAggregated] = useState<boolean>(false);

  //INTL
  const intl = useIntl();

  /**
   * Performs  notification suspension
   */
  const performSuspendNotification = useMemo(
    () => (obj) => {
      return http
        .request({
          url: Endpoints.UserSuspendContributionNotification.url({type: obj.type, id: obj.id}),
          method: Endpoints.UserSuspendContributionNotification.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handles stop notification for contribution
   * @param contribution
   */
  function handleStopContentNotification(contribution) {
    setLoadingSuspendNotification(true);
    performSuspendNotification(contribution)
      .then((data) => {
        const newObj: SCNotificationAggregatedType = obj;
        newObj[contribution.type].suspended = !newObj[contribution.type].suspended;
        setObj(newObj);
        setLoadingSuspendNotification(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Performs comment vote
   */
  const performVoteComment = useMemo(
    () => (comment) => {
      return http
        .request({
          url: Endpoints.CommentVote.url({id: comment.id}),
          method: Endpoints.CommentVote.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handles comment vote
   * @param comment
   */
  function handleVote(index, comment) {
    setLoadingVote(index);
    performVoteComment(comment)
      .then((data) => {
        const newComment: SCCommentType = comment;
        newComment.voted = !newComment.voted;
        newComment.vote_count = newComment.vote_count - (newComment.voted ? -1 : 1);
        const newObj: SCNotificationAggregatedType = obj;
        newObj.aggregated[index] = Object.assign({}, newObj.aggregated[index], newComment);
        setObj(newObj);
        setLoadingVote(null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Render:
   * - discussion/post/status summary if notification include contribute
   * - user header for private message
   */
  function renderNotificationHeader() {
    /**
     * Private messages header
     */
    if (notificationObject.aggregated && notificationObject.aggregated[0].type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      let messageNotification: SCNotificationPrivateMessageType = notificationObject.aggregated[0] as SCNotificationPrivateMessageType;
      return (
        <ListItem alignItems="flex-start" component={'div'}>
          <ListItemAvatar>
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: messageNotification.message.sender.id})}>
              <Avatar alt={messageNotification.message.sender.username} variant="circular" src={messageNotification.message.sender.avatar} />
            </Link>
          </ListItemAvatar>
          <ListItemText
            disableTypography={true}
            primary={
              <Typography component="span" sx={{display: 'inline'}} color="primary">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: messageNotification.message.sender.id})}>
                  {messageNotification.message.sender.username}
                </Link>{' '}
                {intl.formatMessage(messages.receivePrivateMessage, {
                  total: notificationObject.aggregated.length,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            }
          />
        </ListItem>
      );
    }
    /**
     * Comment, NestedComment, Follow Contribution header
     */
    if (
      notificationObject.aggregated &&
      (notificationObject.aggregated[0].type === SCNotificationTypologyType.COMMENT ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.NESTED_COMMENT ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.FOLLOW)
    ) {
      const contribution = getContribute(notificationObject);
      return (
        <>
          {contribution && contribution.type !== SCCommentTypologyType && contribution.summary && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Link to={scRoutingContext.url(contribution.type, {id: notificationObject[contribution.type].id})}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: contribution.summary}} classes={{root: classes.title}} />
              </Link>
              {contribution && (
                <Button
                  variant="outlined"
                  size="small"
                  color={'secondary'}
                  classes={{root: classes.stopNotificationButton}}
                  onClick={() => handleStopContentNotification(contribution)}>
                  {contribution.notification_suspended ? (
                    <NotificationsOffOutlinedIcon fontSize="small" />
                  ) : (
                    <NotificationsOnOutlinedIcon fontSize="small" />
                  )}
                </Button>
              )}
            </Stack>
          )}
        </>
      );
    }
    return null;
  }

  /**
   * Render every single notification in aggregated group
   * @param n
   * @param i
   */
  function renderAggregated(n, i) {
    if (n.type === SCNotificationTypologyType.COMMENT || n.type === SCNotificationTypologyType.NESTED_COMMENT) {
      return <UserNotificationComment notificationObject={n} key={i} index={i} onVote={handleVote} loadingVote={loadingVote} />;
    } else if (n.type === SCNotificationTypologyType.FOLLOW) {
      return <ContributionFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.USER_FOLLOW) {
      return <UserFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.CONNECTION_REQUEST || n.type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      return <UserConnectionNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.VOTE_UP) {
      return <VoteUpNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      return <KindlyNoticeForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      return <KindlyNoticeFlagNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      return <DeletedForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.UNDELETED_FOR) {
      return <UndeletedForNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      return <CollapsedForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      return <UserNotificationPrivateMessage notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.MENTION) {
      return <UserNotificationMention notificationObject={n} key={i} />;
    }
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <CardContent sx={{paddingBottom: 1}}>
        {renderNotificationHeader()}
        {notificationObject.aggregated.slice(0, showMaxAggregated).map((n: SCNotificationType, i) => renderAggregated(n, i))}
        {notificationObject.aggregated.length > showMaxAggregated && (
          <>
            <ListItemButton onClick={() => setOpenOtherAggregated((prev) => !prev)} classes={{root: classes.showOtherAggregated}}>
              <ListItemText
                disableTypography={true}
                primary={<FormattedMessage id={'ui.userNotifications.showOthers'} defaultMessage={'ui.userNotifications.showOthers'} />}
              />
              {openOtherAggregated ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openOtherAggregated} timeout="auto" unmountOnExit>
              {notificationObject.aggregated.slice(showMaxAggregated).map((n: SCNotificationType, i) => renderAggregated(n, i))}
            </Collapse>
          </>
        )}
      </CardContent>
    </Root>
  );
}
