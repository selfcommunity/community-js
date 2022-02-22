import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Send';
import {Link, SCNotificationPrivateMessageType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {grey, red} from '@mui/material/colors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {NotificationObjectTemplateType} from '../../../types';

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.notification.receivePrivateMessage',
    defaultMessage: 'ui.notification.receivePrivateMessage'
  }
});

const PREFIX = 'SCUserNotificationPrivateMessage';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  actions: `${PREFIX}-actions`,
  replyButton: `${PREFIX}-reply-button`,
  replyButtonIcon: `${PREFIX}-reply-button-icon`,
  activeAt: `${PREFIX}-active-at`,
  messageLabel: `${PREFIX}-message-label`,
  messageSender: `${PREFIX}-message-sender`,
  messageWrap: `${PREFIX}-message-wrap`,
  message: `${PREFIX}-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
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
  [`& .${classes.replyButton}`]: {
    minWidth: 30
  },
  [`& .${classes.activeAt}`]: {
    minWidth: 30,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  [`& .${classes.messageSender}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.messageLabel}`]: {
    display: 'inline',
    fontWeight: '600',
    color: `${grey[700]} !important`
  },
  [`& .${classes.messageWrap}`]: {
    display: 'inline-block',
    height: 20
  },
  [`& .${classes.actions}`]: {
    color: grey[600],
    fontSize: '13px',
    maxWidth: '40%'
  }
}));

export interface NotificationPMProps {
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
  notificationObject: SCNotificationPrivateMessageType;

  /**
   * Notification Object template type
   * @default 'preview'
   */
  template?: NotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type private message
 * @param props
 * @constructor
 */
export default function UserNotificationPrivateMessage(props: NotificationPMProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = NotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;

  //INTL
  const intl = useIntl();

  /**
   * Renders content
   */
  let content;
  if (isSnippetTemplate) {
    content = (
      <>
        <ListItem
          component={'div'}
          classes={{root: classNames({[classes.listItemSnippet]: isSnippetTemplate, [classes.listItemSnippetNew]: notificationObject.is_new})}}>
          <ListItemAvatar classes={{root: classes.avatarWrap}}>
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.message.sender.id})}>
              <Avatar
                alt={notificationObject.message.sender.username}
                variant="circular"
                src={notificationObject.message.sender.avatar}
                classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
              />
            </Link>
          </ListItemAvatar>
          <ListItemText
            disableTypography={true}
            primary={
              <Typography component="div" color="inherit">
                <Link
                  to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)}
                  className={classes.messageSender}>
                  {notificationObject.message.sender.username}
                </Link>{' '}
                <Link
                  to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}
                  className={classes.messageLabel}>
                  {intl.formatMessage(messages.receivePrivateMessage, {
                    total: 1,
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
                </Link>
              </Typography>
            }
          />
        </ListItem>
      </>
    );
  } else {
    content = (
      <>
        <ListItem
          component={'div'}
          classes={{root: classNames({[classes.listItemSnippet]: isSnippetTemplate}), secondaryAction: classes.actions}}
          secondaryAction={
            <>
              {!isSnippetTemplate && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                  <Button
                    color={'primary'}
                    variant="outlined"
                    size="small"
                    classes={{root: classes.replyButton}}
                    component={Link}
                    to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}
                    endIcon={<ReplyIcon className={classes.replyButtonIcon} />}>
                    <FormattedMessage
                      id="ui.notification.privateMessage.btnReplyLabel"
                      defaultMessage="ui.notification.privateMessage.btnReplyLabel"
                    />
                  </Button>
                </Stack>
              )}
            </>
          }>
          <ListItemText
            disableTypography={true}
            primary={
              <>
                {notificationObject.is_new && <NewChip />}
                <Box className={classes.messageWrap}>
                  <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)} className={classes.message}>
                    <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.message.html}} />
                  </Link>
                </Box>
              </>
            }
          />
        </ListItem>
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
