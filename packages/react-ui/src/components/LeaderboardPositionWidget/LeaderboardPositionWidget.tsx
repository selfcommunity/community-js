import {useContext, useEffect, useState} from 'react';
import {Avatar, CardContent, Stack, Typography, styled} from '@mui/material';
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
  useIsComponentMountedRef,
  useSCPreferenceEnabled,
  useSCRouting
} from '@selfcommunity/react-core';
import {ScoreService} from '@selfcommunity/api-services';
import {SCLeaderboardEntry, SCUserLeaderboardType} from '@selfcommunity/types';
import {getPeriodRange, LeaderboardPeriod, Logger} from '@selfcommunity/utils';
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

export type LeaderboardPositionWidgetPeriod = LeaderboardPeriod;

export interface LeaderboardPositionWidgetProps extends WidgetProps {
  /**
   * The leaderboard entry of the logged user. If not provided, the component fetches it on its own.
   */
  position?: SCLeaderboardEntry;
  /**
   * The period the position refers to.
   * @default 'month'
   */
  period?: LeaderboardPositionWidgetPeriod;
  /**
   * If true, shows the skeleton in place of the widget content.
   * @default true
   */
  isLoading?: boolean;
  /**
   * The url the widget links to.
   * @default the profile of the logged user
   */
  to?: string;
}

/**
 * > API documentation for the Community-JS Leaderboard Position Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget showing the current logged user position in the leaderboard.
 * The position can be provided via the `position` prop; if it is not provided, the component fetches it on its own.
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
  const {className, position: positionProp, period = 'month', isLoading: isLoadingProp = true, to, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const leaderboardsEnabled = useSCPreferenceEnabled(SCPreferences.CONFIGURATIONS_LEADERBOARDS_ENABLED);

  // Self-fetches the logged user position when it is not provided by the parent
  const shouldFetch = Boolean(scUserContext.user) && leaderboardsEnabled && !positionProp;
  const [fetchedPosition, setFetchedPosition] = useState<SCLeaderboardEntry>(null);
  const [isFetching, setIsFetching] = useState<boolean>(shouldFetch);
  const isMountedRef = useIsComponentMountedRef();

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    setIsFetching(true);
    ScoreService.getLeaderboards({limit: 1, ...getPeriodRange(period)})
      .then((data: SCUserLeaderboardType) => {
        if (isMountedRef.current) {
          setFetchedPosition(data.my_position);
          setIsFetching(false);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        if (isMountedRef.current) {
          setIsFetching(false);
        }
      });
  }, [shouldFetch, period]);

  const position = shouldFetch ? fetchedPosition : positionProp;
  const isLoading = shouldFetch ? isFetching : isLoadingProp;

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
          to={to ?? scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: position.user.id})}
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
