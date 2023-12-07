import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../../shared/DateTimeAgo';
import {ActionsRelevantActivityProps} from '../ActionsRelevantActivity';
import classNames from 'classnames';
import BaseItem from '../../../../../shared/BaseItem';
import UserDeletedSnackBar from '../../../../../shared/UserDeletedSnackBar';
import {PREFIX} from '../../../constants';

const messages = defineMessages({
  pollVote: {
    id: 'ui.feedObject.relevantActivities.pollVote',
    defaultMessage: 'ui.feedObject.relevantActivities.pollVote'
  }
});

const classes = {
  root: `${PREFIX}-activity-poll-vote-root`,
  avatar: `${PREFIX}-activity-poll-vote-avatar`,
  username: `${PREFIX}-activity-poll-vote-username`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'ActivityPollVoteRoot'
})(() => ({}));

export default function PollVoteRelevantActivity(props: ActionsRelevantActivityProps): JSX.Element {
  // PROPS
  const {className = null, activityObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  // RENDER
  return (
    <>
      <Root
        {...rest}
        className={classNames(classes.root, className)}
        image={
          <Link
            {...(!activityObject.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)})}
            onClick={activityObject.author.deleted ? () => setOpenAlert(true) : null}>
            <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} className={classes.avatar} />
          </Link>
        }
        primary={
          <>
            {intl.formatMessage(messages.pollVote, {
              username: (
                <Link
                  {...(!activityObject.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)})}
                  onClick={activityObject.author.deleted ? () => setOpenAlert(true) : null}
                  className={classes.username}>
                  {activityObject.author.username}
                </Link>
              )
            })}
          </>
        }
        secondary={<DateTimeAgo date={activityObject.active_at} />}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
