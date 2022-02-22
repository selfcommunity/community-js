import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCFeedUnitActivityType, SCNotificationUserFollowType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import classNames from 'classnames';

const messages = defineMessages({
  followUser: {
    id: 'ui.notification.userFollow.followUser',
    defaultMessage: 'ui.notification.userFollow.followUser'
  }
});

const PREFIX = 'SCFollowRelevantActivity';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ActionsRelevantActivityProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Activity obj
   * @default null
   */
  activityObject: SCFeedUnitActivityType;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function FollowRelevantActivity(props: ActionsRelevantActivityProps): JSX.Element {
  // PROPS
  const {className = null, activityObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)}>
            <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)}>{activityObject.author.username}</Link>{' '}
              {intl.formatMessage(messages.followUser, {b: (...chunks) => <strong>{chunks}</strong>})}
            </Typography>
          }
          secondary={<DateTimeAgo date={activityObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
