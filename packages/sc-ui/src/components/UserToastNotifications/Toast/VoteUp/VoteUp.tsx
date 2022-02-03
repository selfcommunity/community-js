import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {getContribute} from '../../../../utils/contribute';

const messages = defineMessages({
  appreciated: {
    id: 'ui.userNotifications.voteUp.appreciated',
    defaultMessage: 'ui.userNotifications.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotificationToast';

const classes = {
  content: `${PREFIX}-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${PREFIX}-content`]: {
    padding: '8px 0px 15px 0px'
  }
}));

export interface NotificationVoteUpToastProps {
  /**
   * Id of the feedObject
   * @default 'tn_<notificationObject.feed_serialization_id>'
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
  notificationObject: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the
 * toast notification of type vote up
 * @param props
 * @constructor
 */
export default function VoteUpNotificationToast(props: NotificationVoteUpToastProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `tn_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // Contribute
  const contribution = getContribute(notificationObject);

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem component={'div'} className={classes.content}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>
                {notificationObject.user.username}
              </Link>{' '}
              {intl.formatMessage(messages.appreciated, {
                username: notificationObject.user.username,
                b: (...chunks) => <span>{chunks}</span>
              })}
              :
            </Typography>
          }
          secondary={
            <Typography color="primary">
              {contribution.summary ? (
                contribution.summary
              ) : (
                <Link to={scRoutingContext.url(SCRoutes[`${contribution.type.toUpperCase()}_ROUTE_NAME`], {id: contribution.id})}>
                  <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                </Link>
              )}
            </Typography>
          }
        />
      </ListItem>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <DateTimeAgo date={notificationObject.active_at} />
        <Typography color="primary">
          <Link to={scRoutingContext.url(SCRoutes[`${contribution.type.toUpperCase()}_ROUTE_NAME`], {id: contribution.id})}>
            <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
          </Link>
        </Typography>
      </Stack>
    </Root>
  );
}
