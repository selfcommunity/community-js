import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, ListItem, ListItemText, Typography} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Send';
import {Link, SCNotificationPrivateMessageType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {grey} from '@mui/material/colors';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import classNames from 'classnames';

const PREFIX = 'SCUserNotificationPrivateMessage';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px',
    float: 'left'
  },
  '& .MuiListItemText-root': {
    color: grey[600],
    maxWidth: '60%'
  },
  '& .MuiListItemSecondaryAction-root': {
    color: grey[600],
    fontSize: '13px',
    maxWidth: '40%'
  },
  '& .MuiButton-root': {
    paddingTop: 1,
    paddingBottom: 1
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
        secondaryAction={
          <Box>
            <Box component={'span'} sx={{display: {xs: 'none', md: 'inline-block'}, marginRight: '5px', paddingTop: '5px', float: 'left'}}>
              <DateTimeAgo date={notificationObject.active_at} />
            </Box>
            <Button
              color={'primary'}
              variant="outlined"
              size="small"
              sx={{minWidth: 30}}
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}
              endIcon={<ReplyIcon />}>
              <Box component={'span'} sx={{display: {xs: 'none', md: 'block'}, marginRight: '2px'}}>
                <FormattedMessage id="ui.notification.privateMessage.btnReplyLabel" defaultMessage="ui.notification.privateMessage.btnReplyLabel" />
              </Box>
            </Button>
          </Box>
        }>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Box sx={{display: 'inline-block'}}>
                <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}>
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
