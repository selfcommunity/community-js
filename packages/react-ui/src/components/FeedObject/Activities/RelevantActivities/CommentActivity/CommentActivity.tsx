import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar} from '@mui/material';
import { Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting } from '@selfcommunity/react-core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {ActionsRelevantActivityProps} from '../ActionsRelevantActivity';
import BaseItem from '../../../../../shared/BaseItem';

const messages = defineMessages({
  comment: {
    id: 'ui.feedObject.relevantActivities.comment',
    defaultMessage: 'ui.feedObject.relevantActivities.comment'
  }
});

const PREFIX = 'SCCommentRelevantActivity';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({
  [`& .${classes.username}`]: {
    color: 'inherit'
  },
  [`& .${classes.avatar}`]: {
    width: theme.selfcommunity.user.avatar.sizeMedium,
    height: theme.selfcommunity.user.avatar.sizeMedium
  },
  '& .SCBaseItem-secondary': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

export default function CommentRelevantActivity(inProps: ActionsRelevantActivityProps): JSX.Element {
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
          {intl.formatMessage(messages.comment, {
            username: (
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)} className={classes.username}>
                {activityObject.author.username}
              </Link>
            ),
            comment: activityObject.comment.summary
          })}
        </>
      }
      secondary={<DateTimeAgo date={activityObject.active_at} />}
    />
  );
}
