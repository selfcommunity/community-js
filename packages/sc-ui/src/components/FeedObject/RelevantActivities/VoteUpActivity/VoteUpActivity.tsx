import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {ActionsRelevantActivityProps} from '../FollowActivity';
import classNames from 'classnames';

const messages = defineMessages({
  appreciated: {
    id: 'ui.notification.voteUp.appreciated',
    defaultMessage: 'ui.notification.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpRelevantActivity';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function VoteUpRelevantActivity(props: ActionsRelevantActivityProps): JSX.Element {
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
    <Root className={classNames(classes.root, className)} {...props}>
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
              {intl.formatMessage(messages.appreciated, {
                username: activityObject.author.username,
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={<DateTimeAgo date={activityObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
