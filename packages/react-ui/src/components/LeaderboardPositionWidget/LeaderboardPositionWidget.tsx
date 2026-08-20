import {useContext, useEffect, useState} from 'react';
import {Avatar, Box, CardContent, Stack, Typography, styled} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {
  Link,
  SCPreferences,
  SCRoutes,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  useSCPreferenceEnabled,
  useSCRouting
} from '@selfcommunity/react-core';
import {ScoreService} from '@selfcommunity/api-services';
import {SCLeaderboardEntry, SCUserLeaderboardType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import LeaderboardPositionWidgetSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  user: `${PREFIX}-user`,
  userAvatar: `${PREFIX}-user-avatar`,
  userName: `${PREFIX}-user-name`,
  footer: `${PREFIX}-footer`,
  position: `${PREFIX}-position`,
  score: `${PREFIX}-score`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LeaderboardPositionWidgetProps extends WidgetProps {
  position: SCLeaderboardEntry;
  isLoading?: boolean;
}

/**
 * > API documentation for the Community-JS Leaderboard Position Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget showing the current logged user position in the leaderboard.
 * The widget is hidden if the user is not authenticated, the leaderboard feature is disabled or no position data is available.

 #### Import

 ```jsx
 import {LeaderboardPositionWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLeaderboardPositionWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLeaderboardPositionWidget-root|Styles applied to the root element.|
 |title|.SCLeaderboardPositionWidget-title|Styles applied to the title element.|
 |user|.SCLeaderboardPositionWidget-user|Styles applied to the user element.|
 |userAvatar|.SCLeaderboardPositionWidget-user-avatar|Styles applied to the user avatar element.|
 |userName|.SCLeaderboardPositionWidget-user-name|Styles applied to the username element.|
 |footer|.SCLeaderboardPositionWidget-footer|Styles applied to the footer element.|
 |position|.SCLeaderboardPositionWidget-position|Styles applied to the position element.|
 |score|.SCLeaderboardPositionWidget-score|Styles applied to the score element.|
 *
 * @param inProps
 */
export default function LeaderboardPositionWidget(inProps: LeaderboardPositionWidgetProps): JSX.Element {
  const props: LeaderboardPositionWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, position, isLoading = true, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const leaderboardsEnabled = useSCPreferenceEnabled(SCPreferences.CONFIGURATIONS_LEADERBOARDS_ENABLED);

  /**
   * Renders nothing if the user is not authenticated or the leaderboard feature is disabled
   */
  if (!scUserContext.user || !leaderboardsEnabled) {
    return <HiddenPlaceholder />;
  }

  /**
   * Renders the skeleton while fetching the position data
   */
  if (isLoading) {
    return <LeaderboardPositionWidgetSkeleton />;
  }

  /**
   * Renders nothing if there's no position data
   */
  if (!position) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage id="ui.leaderboardPositionWidget.title" defaultMessage="ui.leaderboardPositionWidget.title" />
        </Typography>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: position.user.id})}
          className={classes.user}>
          <Avatar alt={position.user.username} src={position.user.avatar} className={classes.userAvatar} />
          <Typography variant="body1" fontWeight={600} className={classes.userName}>
            {position.user.real_name || position.user.username}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.footer}>
          <Typography variant="h3" className={classes.position}>
            <FormattedMessage
              id="ui.leaderboardPositionWidget.position"
              defaultMessage="ui.leaderboardPositionWidget.position"
              values={{position: position.position}}
            />
          </Typography>
          <Typography variant="body1" className={classes.score}>
            <FormattedMessage
              id="ui.leaderboardPositionWidget.score"
              defaultMessage="ui.leaderboardPositionWidget.score"
              values={{score: position.total_score}}
            />
          </Typography>
        </Stack>
      </CardContent>
    </Root>
  );
}
