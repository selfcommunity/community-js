import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, ListItem, ListItemText, Stack, Typography} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Send';
import {Link, SCNotificationPrivateMessageType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {grey} from '@mui/material/colors';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';

const PREFIX = 'SCUserNotificationPrivateMessage';

const classes = {
  root: `${PREFIX}-root`,
  actions: `${PREFIX}-actions`,
  replyButton: `${PREFIX}-reply-button`,
  replyButtonIcon: `${PREFIX}-reply-button-icon`,
  activeAt: `${PREFIX}-active-at`,
  messageWrap: `${PREFIX}-message-wrap`,
  message: `${PREFIX}-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.replyButton}`]: {
    minWidth: 30
  },
  [`& .${classes.activeAt}`]: {
    minWidth: 30,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  [`& .${classes.messageWrap}`]: {
    display: 'inline-block'
  },
  [`& .${classes.messageWrap}`]: {
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
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem
        component={'div'}
        classes={{secondaryAction: classes.actions}}
        secondaryAction={
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
              <FormattedMessage id="ui.notification.privateMessage.btnReplyLabel" defaultMessage="ui.notification.privateMessage.btnReplyLabel" />
            </Button>
          </Stack>
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
    </Root>
  );
}
