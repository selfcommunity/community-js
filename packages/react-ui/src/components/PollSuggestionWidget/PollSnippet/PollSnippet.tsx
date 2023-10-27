import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
import {SCFeedDiscussionType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {getContributionRouteName, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import BaseItem from '../../../shared/BaseItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-poll-snippet-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  title: `${PREFIX}-title`,
  activityAt: `${PREFIX}-activity-at`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'PollSnippetRoot'
})(() => ({}));

export interface PollSnippetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The feed Object
   * @default null
   */
  feedObj?: SCFeedDiscussionType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PollSnippet component. Learn about the available props and the CSS API.
 *
 *

 #### Import
 ```jsx
 import {PollSnippet} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCPollSuggestionWidget-poll-snippet-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSuggestionWidget-poll-snippet-root|Styles applied to the root element.|
 |avatar|.SCPollSuggestionWidget-avatar|Styles applied to the avatar element.|
 |username|.SCPollSuggestionWidget-username|Styles applied to the username element.|
 |title|.SCPollSuggestionWidget-title|Styles applied to the title element.|
 |activityAt|.SCPollSuggestionWidget-activity-at|Styles applied to activity section.|

 * @param inProps
 */
export default function PollSnippet(inProps: PollSnippetProps): JSX.Element {
  // PROPS
  const props: PollSnippetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {feedObj = null, className = null, autoHide = false, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // RENDER
  if (!autoHide) {
    return (
      <>
        <Root
          elevation={0}
          className={classNames(classes.root, className)}
          image={
            <Link
              {...(!feedObj.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, feedObj.author)})}
              onClick={feedObj.author.deleted ? () => setOpenAlert(true) : null}>
              <UserAvatar hide={!feedObj.author.community_badge}>
                <Avatar alt={feedObj.author.username} variant="circular" src={feedObj.author.avatar} className={classes.avatar} />
              </UserAvatar>
            </Link>
          }
          primary={
            <Box>
              <Link
                {...(!feedObj.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, feedObj.author)})}
                className={classes.username}
                onClick={feedObj.author.deleted ? () => setOpenAlert(true) : null}>
                {feedObj.author.username}
              </Link>
              <Typography variant="body2" className={classes.title}>
                {feedObj.poll.title}
              </Typography>
            </Box>
          }
          disableTypography
          secondary={
            <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
              <Link to={scRoutingContext.url(getContributionRouteName(feedObj), getRouteData(feedObj))} className={classes.activityAt}>
                <DateTimeAgo component="span" date={feedObj.added_at} />
              </Link>
              <Button
                component={Link}
                to={scRoutingContext.url(getContributionRouteName(feedObj), getRouteData(feedObj))}
                variant="text"
                color="secondary"
                size="small">
                <FormattedMessage
                  id="ui.pollSuggestionWidget.pollSnippet.button.seeItem"
                  defaultMessage="ui.pollSuggestionWidget.pollSnippet.button.seeItem"
                />
              </Button>
            </Stack>
          }
        />
        {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
      </>
    );
  }
  return null;
}
