import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCCommentType, SCContributionType, SCFeedObjectType, SCNotificationCommentType, SCNotificationTypologyType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../shared/Bullet';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import {getContributionSnippet, getRouteData} from '../../../utils/contribution';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import VoteButton from '../../VoteButton';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';

const messages = defineMessages({
  comment: {
    id: 'ui.notification.comment.comment',
    defaultMessage: 'ui.notification.comment.comment'
  },
  nestedComment: {
    id: 'ui.notification.comment.nestedComment',
    defaultMessage: 'ui.notification.comment.nestedComment'
  }
});

const classes = {
  root: `${PREFIX}-comment-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  voteButton: `${PREFIX}-vote-button`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'CommentRoot'
})(() => ({}));

export interface CommentNotificationProps
  extends Pick<
    NotificationItemProps,
    Exclude<
      keyof NotificationItemProps,
      'image' | 'disableTypography' | 'primary' | 'primaryTypographyProps' | 'secondary' | 'secondaryTypographyProps' | 'actions' | 'footer' | 'isNew'
    >
  > {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationCommentType;

  /**
   * Handles action on vote
   * @default null
   */
  onVote?: (contribution: SCFeedObjectType | SCCommentType) => any;
}

/**
 * This component render the content of the notification of type comment/nested comment
 * @param props
 * @constructor
 */
export default function CommentNotification(props: CommentNotificationProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    onVote,
    id = `n_${props.notificationObject['sid']}`,
    template = SCNotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //INTL
  const intl = useIntl();

  // HANDLERS
  const handleVote = (contribution: SCFeedObjectType | SCCommentType) => {
    return onVote && onVote(contribution);
  };

  /**
   * Renders root object
   */
  return (
    <>
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.comment.author.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)
            })}
            onClick={notificationObject.comment.author.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.comment.author.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.comment.author.username}
                variant="circular"
                src={notificationObject.comment.author.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject.comment.author.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)
              })}
              onClick={notificationObject.comment.author.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.comment.author.username}
            </Link>{' '}
            {notificationObject.type === SCNotificationTypologyType.NESTED_COMMENT
              ? intl.formatMessage(messages.comment, {
                  b: (...chunks) => <strong>{chunks}</strong>
                })
              : intl.formatMessage(messages.nestedComment, {
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
          </>
        }
        secondary={
          <React.Fragment>
            <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))}>
              <Typography variant="body2" className={classes.contributionText}>
                {getContributionSnippet(notificationObject.comment)}
              </Typography>
            </Link>
            {(template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                <Bullet className={classes.bullet} />
                <VoteButton
                  className={classes.voteButton}
                  variant="text"
                  size="small"
                  contributionId={notificationObject.comment.id}
                  contributionType={SCContributionType.COMMENT}
                  contribution={notificationObject.comment}
                  onVote={handleVote}
                />
              </Stack>
            )}
          </React.Fragment>
        }
        footer={
          template === SCNotificationObjectTemplateType.TOAST && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary" component={'div'}>
                <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))}>
                  <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                </Link>
              </Typography>
            </Stack>
          )
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
