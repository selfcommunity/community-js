import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCNotificationMentionType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import {getContributeType} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.userNotifications.mention.quotedYou',
    defaultMessage: 'ui.userNotifications.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMentionToast';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export interface NotificationMentionToastProps {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function UserNotificationMentionToast(props: NotificationMentionToastProps): JSX.Element {

  // PROPS
  const {notificationObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const objectType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return <div dangerouslySetInnerHTML={{__html: notificationObject.html}} />;
  /* return (
    <Root {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject[objectType].author.id})}>
            <Avatar alt={notificationObject[objectType].author.username} variant="circular" src={notificationObject[objectType].author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject[objectType].author.id})}>
                {notificationObject[objectType].author.username}
              </Link>{' '}
              {intl.formatMessage(messages.quotedYouOn, {
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link to={scRoutingContext.url(objectType, {id: notificationObject[objectType].id})}>
                <Typography
                  component={'span'}
                  variant="body2"
                  sx={{textDecoration: 'underline'}}
                  gutterBottom
                  dangerouslySetInnerHTML={{__html: notificationObject[objectType].summary}}
                />
              </Link>
              <DateTimeAgo date={notificationObject.active_at} />
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  ); */
}
