import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
import {SCFeedDiscussionType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {getContributionRouteName, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import BaseItem from '../../../shared/BaseItem';

const PREFIX = 'SCPollSnippet';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  title: `${PREFIX}-title`,
  activityAt: `${PREFIX}-activity-at`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({
  [`&.${classes.root} > div`]: {
    alignItems: 'flex-start'
  },
  '& .SCBaseItem-text': {
    marginTop: 0
  },
  [`& .${classes.username}`]: {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    textDecoration: 'none'
  },
  [`& .${classes.title}`]: {},
  [`& .${classes.avatar}`]: {
    width: theme.selfcommunity.user.avatar.sizeMedium,
    height: theme.selfcommunity.user.avatar.sizeMedium
  },
  [`& .${classes.activityAt}`]: {
    textDecoration: 'none',
    color: 'inherit',
    marginTop: 3
  }
}));

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
 * #### Import
 ```jsx
 import {PollSnippet} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCPollSnippet` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSnippet-root|Styles applied to the root element.|
 |title|.SCPollSnippet-title|Styles applied to the title element.|
 |action|.SCPollSnippet-actions|Styles applied to action section.|
 |seeItem|.SCPollSnippet-see-item|Styles applied to the see item button element.|

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

  // RENDER
  if (!autoHide) {
    return (
      <Root
        elevation={0}
        className={classNames(classes.root, className)}
        image={
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, feedObj.author)}>
            <Avatar alt={feedObj.author.username} variant="circular" src={feedObj.author.avatar} className={classes.avatar} />
          </Link>
        }
        primary={
          <Box>
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, feedObj.author)} className={classes.username}>
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
    );
  }
  return null;
}
