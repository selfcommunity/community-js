import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography} from '@mui/material';
import {Link, SCNotificationCommentType, SCNotificationTypologyType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import {red} from '@mui/material/colors';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {getContributionSnippet, getRouteData} from '../../../utils/contribute';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';

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
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  username: `${PREFIX}-username`,
  voteButton: `${PREFIX}-vote-button`,
  commentText: `${PREFIX}-comment-text`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`,
  toastInfo: `${PREFIX}-toast-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.listItemSnippet}`]: {
    padding: '0px 5px',
    alignItems: 'center'
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: '2px solid red'
  },
  [`& .${classes.avatarWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.avatarSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.voteButton}`]: {
    marginLeft: '-1px',
    minWidth: '30px',
    paddingTop: 3
  },
  [`& .${classes.commentText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10
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
 * @param props
 * @constructor
 */
export default function CommentNotification(props: CommentNotificationProps): JSX.Element {
  // PROPS
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

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{
          root: classNames({
            [classes.listItemSnippet]: isToastTemplate || isSnippetTemplate,
            [classes.listItemSnippetNew]: isSnippetTemplate && notificationObject.is_new
          })
        }}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)}>
            <Avatar
              alt={notificationObject.comment.author.username}
              variant="circular"
              src={notificationObject.comment.author.avatar}
              classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
              <Typography component="span" className={classes.commentText} color="inherit">
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
              {template === SCNotificationObjectTemplateType.DETAIL && (
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                  <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                  <Bullet className={classes.bullet} />
                  <LoadingButton
                    color={'inherit'}
                    classes={{root: classes.voteButton}}
                    variant={'text'}
                    onClick={() => {
                      onVote && index && onVote(index, notificationObject.comment);
                    }}
                    disabled={loadingVote === index}
                    loading={loadingVote === index}>
                    {notificationObject.comment.voted ? (
                      <Tooltip
                        title={<FormattedMessage id={'ui.notification.comment.voteDown'} defaultMessage={'ui.notification.comment.voteDown'} />}>
                        <Icon fontSize={'small'} color={'secondary'}>
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
            </>
          }
        />
      </ListItem>
      {template === SCNotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <DateTimeAgo date={notificationObject.active_at} />
          <Typography color="primary">
            <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))} sx={{textDecoration: 'underline'}}>
              <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
            </Link>
          </Typography>
        </Stack>
      )}
    </Root>
  );
}
