import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {
  Link,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationTypologyType,
  SCRoutes,
  SCRoutingContextType,
  useSCRouting
} from '@selfcommunity/core';
import classNames from 'classnames';
import { grey, red } from '@mui/material/colors';
import {NotificationObjectTemplateType} from '../../../types';

const messages = defineMessages({
  requestConnection: {
    id: 'ui.notification.userConnection.requestConnection',
    defaultMessage: 'ui.notification.userConnection.requestConnection'
  },
  acceptConnection: {
    id: 'ui.notification.userConnection.acceptConnection',
    defaultMessage: 'ui.notification.userConnection.acceptConnection'
  }
});

const PREFIX = 'SCUserConnectionNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  connectionText: `${PREFIX}-connection-text`,
  activeAt: `${PREFIX}-active-at`
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
  [`& .${classes.connectionText}`]: {
    display: 'inline',
    fontWeight: '600',
    color: grey[600]
  }
}));

export interface NotificationConnectionProps {
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
  notificationObject: SCNotificationConnectionRequestType | SCNotificationConnectionAcceptType;

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
 * This component render the content of the notification of connection accept/request
 * @param props
 * @constructor
 */
export default function UserConnectionNotification(props: NotificationConnectionProps): JSX.Element {
  // PROPS
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = NotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;
  const userConnection =
    notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST ? notificationObject.request_user : notificationObject.accept_user;

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{root: classNames({[classes.listItemSnippet]: isSnippetTemplate, [classes.listItemSnippetNew]: notificationObject.is_new})}}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, userConnection)}>
            <Avatar
              alt={userConnection.username}
              variant="circular"
              src={userConnection.avatar}
              classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {!isSnippetTemplate && notificationObject.is_new && <NewChip />}
              <Typography component="div" className={classes.connectionText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, userConnection)}>{userConnection.username}</Link>{' '}
                {notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST
                  ? intl.formatMessage(messages.requestConnection, {b: (...chunks) => <strong>{chunks}</strong>})
                  : intl.formatMessage(messages.requestConnection, {b: (...chunks) => <strong>{chunks}</strong>})}
              </Typography>
            </>
          }
          secondary={<>{!isSnippetTemplate && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}</>}
        />
      </ListItem>
    </Root>
  );
}
