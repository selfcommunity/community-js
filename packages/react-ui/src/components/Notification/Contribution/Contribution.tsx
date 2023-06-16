import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Stack, Typography} from '@mui/material';
import {SCCommentType, SCContributionType, SCFeedObjectType, SCNotificationContributionType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {getContributionSnippet, getContributionType, getRouteData} from '../../../utils/contribution';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import Bullet from '../../../shared/Bullet';
import VoteButton from '../../VoteButton';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';

const messages = defineMessages({
  postOrStatus: {
    id: 'ui.notification.contribution.newPostOrStatus',
    defaultMessage: 'ui.notification.contribution.newPostOrStatus'
  },
  discussion: {
    id: 'ui.notification.contribution.discussion',
    defaultMessage: 'ui.notification.contribution.discussion'
  },
  postOrStatusSnippet: {
    id: 'ui.notification.contribution.snippet.newPostOrStatus',
    defaultMessage: 'ui.notification.contribution.snippet.newPostOrStatus'
  },
  discussionSnippet: {
    id: 'ui.notification.contribution.snippet.discussion',
    defaultMessage: 'ui.notification.contribution.snippet.discussion'
  }
});

const PREFIX = 'SCContributionNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  voteButton: `${PREFIX}-vote-button`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ContributionNotificationProps
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
  notificationObject: SCNotificationContributionType;

  /**
   * Handles action on vote
   * @default null
   */
  onVote?: (contribution: SCFeedObjectType | SCCommentType) => any;
}

/**
 * This component render the content of the notification of type follow (contribution)
 * @param inProps
 * @constructor
 */
export default function ContributionNotification(inProps: ContributionNotificationProps): JSX.Element {
  // PROPS
  const props: ContributionNotificationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    onVote,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const contributionType: SCContributionType = getContributionType(notificationObject);

  // INTL
  const intl = useIntl();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

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
            {...(!notificationObject[contributionType].author.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[contributionType].author)
            })}
            onClick={notificationObject[contributionType].author.deleted ? () => setOpenAlert(true) : null}>
            <Avatar
              alt={notificationObject[contributionType].author.username}
              variant="circular"
              src={notificationObject[contributionType].author.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject[contributionType].author.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[contributionType].author)
              })}
              onClick={notificationObject[contributionType].author.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject[contributionType].author.username}
            </Link>{' '}
            {template === SCNotificationObjectTemplateType.SNIPPET ? (
              <>
                {notificationObject[contributionType]['type'] === SCContributionType.POST ||
                notificationObject[contributionType]['type'] === SCContributionType.STATUS
                  ? intl.formatMessage(messages.postOrStatusSnippet, {contribution: notificationObject[contributionType]['type']})
                  : intl.formatMessage(messages.discussionSnippet)}
              </>
            ) : (
              <>
                {notificationObject[contributionType]['type'] === SCContributionType.POST ||
                notificationObject[contributionType]['type'] === SCContributionType.STATUS
                  ? intl.formatMessage(messages.postOrStatus, {contribution: notificationObject[contributionType]['type']})
                  : intl.formatMessage(messages.discussion)}
              </>
            )}
          </>
        }
        secondary={
          <React.Fragment>
            {template === SCNotificationObjectTemplateType.SNIPPET && (
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}>
                <Typography variant="body2" className={classes.contributionText} component={'div'}>
                  {getContributionSnippet(notificationObject[contributionType])}
                </Typography>
              </Link>
            )}
            {template === SCNotificationObjectTemplateType.DETAIL && (
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                <Bullet className={classes.bullet} />
                <VoteButton
                  className={classes.voteButton}
                  variant="text"
                  size="small"
                  contributionId={notificationObject[contributionType].id}
                  contributionType={contributionType}
                  contribution={notificationObject[contributionType]}
                  onVote={handleVote}
                />
              </Stack>
            )}
            {template === SCNotificationObjectTemplateType.SNIPPET && (
              <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            )}
          </React.Fragment>
        }
        footer={
          template === SCNotificationObjectTemplateType.TOAST && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary" component={'div'}>
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}>
                  <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                </Link>
              </Typography>
            </Stack>
          )
        }
        {...rest}
      />
      <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />
    </>
  );
}
