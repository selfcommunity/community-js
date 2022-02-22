import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography} from '@mui/material';
import {Link, SCNotificationCommentType, SCNotificationTypologyType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import {grey, red} from '@mui/material/colors';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {getContributionSnippet, getRouteData} from '../../../utils/contribute';
import classNames from 'classnames';

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
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  voteButton: `${PREFIX}-vote-button`,
  commentText: `${PREFIX}-comment-text`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`,
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.voteButton}`]: {
    marginLeft: '-1px',
    minWidth: '30px',
    paddingTop: 3
  },
  [`& .${classes.commentText}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
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
   * Index
   * @default null
   */
  index: number;

  /**
   * Handles action on vote
   * @default null
   */
  onVote: (i, v) => void;

  /**
   * The id of the loading vote
   * @default null
   */
  loadingVote: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type comment/nested comment
 * @param props
 * @constructor
 */
export default function CommentNotification(props: CommentNotificationProps): JSX.Element {
  // PROPS
  const {notificationObject, index, onVote, loadingVote, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)}>
            <Avatar
              alt={notificationObject.comment.author.username}
              variant="circular"
              src={notificationObject.comment.author.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="span" className={classes.commentText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)}>
                  {notificationObject.comment.author.username}
                </Link>{' '}
                {notificationObject.type === SCNotificationTypologyType.NESTED_COMMENT
                  ? intl.formatMessage(messages.comment, {
                      b: (...chunks) => <strong>{chunks}</strong>
                    })
                  : intl.formatMessage(messages.nestedComment, {
                      b: (...chunks) => <strong>{chunks}</strong>
                    })}
              </Typography>
            </>
          }
          secondary={
            <>
              <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))}>
                <Typography variant="body2" gutterBottom className={classes.contributionText}>
                  {getContributionSnippet(notificationObject.comment)}
                </Typography>
              </Link>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                <Bullet className={classes.bullet} />
                <LoadingButton
                  color={'inherit'}
                  classes={{root: classes.voteButton}}
                  variant={'text'}
                  onClick={() => onVote(index, notificationObject.comment)}
                  disabled={loadingVote === index}
                  loading={loadingVote === index}>
                  {notificationObject.comment.voted ? (
                    <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteDown'} defaultMessage={'ui.notification.comment.voteDown'} />}>
                      <VoteFilledIcon fontSize={'small'} color={'secondary'} />
                    </Tooltip>
                  ) : (
                    <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteUp'} defaultMessage={'ui.notification.comment.voteUp'} />}>
                      <VoteIcon fontSize={'small'} color="inherit" />
                    </Tooltip>
                  )}
                </LoadingButton>
              </Stack>
            </>
          }
        />
      </ListItem>
    </Root>
  );
}
