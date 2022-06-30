import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Tooltip, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationCommentType, SCNotificationTypologyType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import {getContributionSnippet, getRouteData} from '../../../utils/contribution';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem from '../../../shared/NotificationItem';

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

const PREFIX = 'SCCommentNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  voteButton: `${PREFIX}-vote-button`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.voteButton}`]: {
    marginLeft: '-1px',
    minWidth: '30px',
    paddingTop: 3,
    '& > span': {
      fontSize: '15px'
    }
  },
  [`& .${classes.contributionText}`]: {
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export interface CommentNotificationProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
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
  notificationObject: SCNotificationCommentType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Index
   * @default null
   */
  index?: number;

  /**
   * Handles action on vote
   * @default null
   */
  onVote?: (i, v) => void;

  /**
   * The id of the loading vote
   * @default null
   */
  loadingVote?: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type comment/nested comment
 * @param inProps
 * @constructor
 */
export default function CommentNotification(inProps: CommentNotificationProps): JSX.Element {
  // PROPS
  const props: CommentNotificationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    index,
    onVote,
    loadingVote,
    id = `n_${props.notificationObject['sid']}`,
    template = SCNotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //INTL
  const intl = useIntl();

  /**
   * Handle vote
   */
  function handleVote() {
    return onVote && index !== undefined && onVote(index, notificationObject.comment);
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <NotificationItem
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject['follower'])}>
            <Avatar
              alt={notificationObject.comment.author.username}
              variant="circular"
              src={notificationObject.comment.author.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        }
        primary={
          <>
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)} className={classes.username}>
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
              <Typography variant="body2" gutterBottom className={classes.contributionText}>
                {getContributionSnippet(notificationObject.comment)}
              </Typography>
            </Link>
            {template === SCNotificationObjectTemplateType.DETAIL && (
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                <Bullet className={classes.bullet} />
                <LoadingButton
                  color={'inherit'}
                  size={'small'}
                  classes={{root: classes.voteButton}}
                  variant={'text'}
                  onClick={handleVote}
                  disabled={loadingVote === index}
                  loading={loadingVote === index}>
                  {notificationObject.comment.voted ? (
                    <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteDown'} defaultMessage={'ui.notification.comment.voteDown'} />}>
                      <Icon fontSize={'small'} color={'primary'}>
                        thumb_up_alt
                      </Icon>
                    </Tooltip>
                  ) : (
                    <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteUp'} defaultMessage={'ui.notification.comment.voteUp'} />}>
                      <Icon fontSize={'small'} color="inherit">
                        thumb_up_off_alt
                      </Icon>
                    </Tooltip>
                  )}
                </LoadingButton>
              </Stack>
            )}
          </React.Fragment>
        }
        footer={
          <>
            {template === SCNotificationObjectTemplateType.TOAST && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
                <Typography color="primary" component={'div'}>
                  <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))}>
                    <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                  </Link>
                </Typography>
              </Stack>
            )}
          </>
        }
      />
    </Root>
  );
}
