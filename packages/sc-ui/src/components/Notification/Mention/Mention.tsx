import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCCommentTypologyType, SCNotificationMentionType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import {getRouteData, getContributeType} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.notification.mention.quotedYou',
    defaultMessage: 'ui.notification.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMention';

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

export interface NotificationMentionProps {
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
  notificationObject: SCNotificationMentionType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type mention
 * @param props
 * @constructor
 */
export default function UserNotificationMention(props: NotificationMentionProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const objectType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
            <Avatar alt={notificationObject[objectType].author.username} variant="circular" src={notificationObject[objectType].author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
                {notificationObject[objectType].author.username}
              </Link>{' '}
              {intl.formatMessage(messages.quotedYouOn, {
                b: (...chunks) => <strong>{chunks}</strong>
              })}{' '}
              :
            </Typography>
          }
          secondary={
            <div>
              {notificationObject.is_new && <NewChip />}
              <Typography component="div" gutterBottom>
                <Link to={scRoutingContext.url(SCRoutes[`${objectType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[objectType]))}>
                  <Typography
                    component={'span'}
                    variant="body2"
                    sx={{textDecoration: 'underline'}}
                    gutterBottom
                    dangerouslySetInnerHTML={{__html: notificationObject[objectType].summary}}
                  />
                </Link>
              </Typography>
              <DateTimeAgo date={notificationObject.active_at} />
            </div>
          }
        />
      </ListItem>
    </Root>
  );
}
