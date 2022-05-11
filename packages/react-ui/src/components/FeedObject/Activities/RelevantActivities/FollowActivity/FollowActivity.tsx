import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../../shared/DateTimeAgo';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {ActionsRelevantActivityProps} from '../ActionsRelevantActivity';
import BaseItem from '../../../../../shared/BaseItem';

const messages = defineMessages({
  follow: {
    id: 'ui.feedObject.relevantActivities.follow',
    defaultMessage: 'ui.feedObject.relevantActivities.follow'
  }
});

const PREFIX = 'SCFollowRelevantActivity';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    color: 'inherit'
  }
}));

export default function FollowRelevantActivity(inProps: ActionsRelevantActivityProps): JSX.Element {
  // PROPS
  const props: ActionsRelevantActivityProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, activityObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // RENDER
  return (
    <Root
      {...rest}
      className={classNames(classes.root, className)}
      image={
        <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)}>
          <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} className={classes.avatar} />
        </Link>
      }
      primary={
        <>
          {intl.formatMessage(messages.follow, {
            username: (
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)} className={classes.username}>
                {activityObject.author.username}
              </Link>
            )
          })}
        </>
      }
      secondary={<DateTimeAgo date={activityObject.active_at} />}
    />
  );
}
