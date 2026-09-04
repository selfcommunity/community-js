import {useContext, useEffect, useState} from 'react';
import {Avatar, Box, CardContent, Stack, Typography, styled} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import crownIcon from '../../assets/leaderboard/crown';
import {SCPreferences, SCUserContext, SCUserContextType, useIsComponentMountedRef, useSCPreferenceEnabled} from '@selfcommunity/react-core';
import {ScoreService} from '@selfcommunity/api-services';
import {SCLeaderboardEntry, SCUserLeaderboardType} from '@selfcommunity/types';
import {getPeriodRange, LeaderboardPeriod, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import LeaderboardWidgetSkeleton from './Skeleton';

const RANKING_LIMIT = 5;
const PODIUM_LIMIT = 3;

const classes = {
  root: `${PREFIX}-root`,
  podiumHeader: `${PREFIX}-podium-header`,
  podiumTitle: `${PREFIX}-podium-title`,
  podium: `${PREFIX}-podium`,
  podiumItem: `${PREFIX}-podium-item`,
  podiumCrown: `${PREFIX}-podium-crown`,
  podiumAvatarWrap: `${PREFIX}-podium-avatar-wrap`,
  podiumAvatar: `${PREFIX}-podium-avatar`,
  podiumBadge: `${PREFIX}-podium-badge`,
  podiumName: `${PREFIX}-podium-name`,
  podiumScore: `${PREFIX}-podium-score`,
  rankingHeader: `${PREFIX}-ranking-header`,
  rankingTitle: `${PREFIX}-ranking-title`,
  rankingList: `${PREFIX}-ranking-list`,
  rankingItem: `${PREFIX}-ranking-item`,
  rankingItemActive: `${PREFIX}-ranking-item-active`,
  rankingPosition: `${PREFIX}-ranking-position`,
  rankingAvatar: `${PREFIX}-ranking-avatar`,
  rankingName: `${PREFIX}-ranking-name`,
  rankingScore: `${PREFIX}-ranking-score`,
  seeMore: `${PREFIX}-see-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export type LeaderboardWidgetVariant = 'full' | 'podium';

export type LeaderboardWidgetPeriod = LeaderboardPeriod;

export interface LeaderboardWidgetProps extends WidgetProps {
  /**
   * The widget mode.
   * `full` renders the podium and the general ranking list, `podium` renders the podium only.
   * @default 'full'
   */
  mode?: LeaderboardWidgetVariant;
  /**
   * The period the podium refers to.
   * @default 'month'
   */
  period?: LeaderboardWidgetPeriod;
  /**
   * The leaderboard entries to render. The top 3 entries (by position) are rendered in the podium,
   * the full list is rendered in the general ranking (for the `full` mode).
   */
  entries?: SCLeaderboardEntry[];
  /**
   * If true, shows the skeleton in place of the widget content.
   * @default true
   */
  isLoading?: boolean;
  /**
   * Callback fired when the user clicks on the "see more" action.
   */
  onSeeMoreClick?: () => void;
}

/**
 * > API documentation for the Community-JS Leaderboard Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget showing the top 3 users of the leaderboard for the given period (podium) and, optionally, the general ranking list.
 * Leaderboard entries can be provided via the `entries` prop; if `mode` is `full` and no `entries` are provided, the component fetches the general
 * ranking on its own.
 * The widget is hidden if the leaderboard feature is disabled or no podium data is available.

 #### Import

 ```jsx
 import {LeaderboardWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLeaderboardWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLeaderboardWidget-root|Styles applied to the root element.|
 |podiumHeader|.SCLeaderboardWidget-podium-header|Styles applied to the podium header element.|
 |podiumTitle|.SCLeaderboardWidget-podium-title|Styles applied to the podium title element.|
 |podium|.SCLeaderboardWidget-podium|Styles applied to the podium element.|
 |podiumItem|.SCLeaderboardWidget-podium-item|Styles applied to the single podium item.|
 |podiumCrown|.SCLeaderboardWidget-podium-crown|Styles applied to the crown icon of the first podium item.|
 |podiumAvatarWrap|.SCLeaderboardWidget-podium-avatar-wrap|Styles applied to the avatar wrapper of the single podium item.|
 |podiumAvatar|.SCLeaderboardWidget-podium-avatar|Styles applied to the avatar of the single podium item.|
 |podiumBadge|.SCLeaderboardWidget-podium-badge|Styles applied to the position badge of the single podium item.|
 |podiumName|.SCLeaderboardWidget-podium-name|Styles applied to the name of the single podium item.|
 |podiumScore|.SCLeaderboardWidget-podium-score|Styles applied to the score of the single podium item.|
 |rankingHeader|.SCLeaderboardWidget-ranking-header|Styles applied to the ranking header element.|
 |rankingTitle|.SCLeaderboardWidget-ranking-title|Styles applied to the ranking title element.|
 |rankingList|.SCLeaderboardWidget-ranking-list|Styles applied to the ranking list element.|
 |rankingItem|.SCLeaderboardWidget-ranking-item|Styles applied to the single ranking item.|
 |rankingItemActive|.SCLeaderboardWidget-ranking-item-active|Styles applied to the single ranking item when it belongs to the logged user.|
 |rankingPosition|.SCLeaderboardWidget-ranking-position|Styles applied to the position of the single ranking item.|
 |rankingAvatar|.SCLeaderboardWidget-ranking-avatar|Styles applied to the avatar of the single ranking item.|
 |rankingName|.SCLeaderboardWidget-ranking-name|Styles applied to the name of the single ranking item.|
 |rankingScore|.SCLeaderboardWidget-ranking-score|Styles applied to the score of the single ranking item.|
 |seeMore|.SCLeaderboardWidget-see-more|Styles applied to the "see more" action element.|
 *
 * @param inProps
 */
export default function LeaderboardWidget(inProps: LeaderboardWidgetProps): JSX.Element {
  const props: LeaderboardWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, mode = 'full', period = 'month', entries: entriesProp, isLoading: isLoadingProp = true, onSeeMoreClick, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PREFERENCES
  const leaderboardsEnabled = useSCPreferenceEnabled(SCPreferences.CONFIGURATIONS_LEADERBOARDS_ENABLED);

  // Self-fetches the leaderboard data when running in `full` mode and no entries are provided by the parent
  const shouldFetch = mode === 'full' && !entriesProp;
  const [fetchedEntries, setFetchedEntries] = useState<SCLeaderboardEntry[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(shouldFetch);
  const isMountedRef = useIsComponentMountedRef();

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    setIsFetching(true);
    ScoreService.getLeaderboards({limit: RANKING_LIMIT, ...getPeriodRange(period)})
      .then((data: SCUserLeaderboardType) => {
        if (isMountedRef.current) {
          setFetchedEntries(data.results);
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

  const entries = shouldFetch ? fetchedEntries : entriesProp || [];
  const isLoading = shouldFetch ? isFetching : isLoadingProp;

  /**
   * Renders nothing if the leaderboard feature is disabled
   */
  if (!leaderboardsEnabled) {
    return <HiddenPlaceholder />;
  }

  /**
   * Renders the skeleton while the leaderboard data is loading
   */
  if (isLoading) {
    return <LeaderboardWidgetSkeleton mode={mode} />;
  }

  // Entries can share the same position: the podium shows only the first one of each of the first three positions, while the ranking list below shows them all
  const podium = entries
    .filter((entry, index) => entry.position <= PODIUM_LIMIT && entries.findIndex((e) => e.position === entry.position) === index)
    .slice(0, PODIUM_LIMIT);

  /**
   * Renders nothing if there's no podium data
   */
  if (!podium.length) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.podiumHeader}>
          <Typography variant="h4" className={classes.podiumTitle}>
            <FormattedMessage id="ui.leaderboardWidget.podium.title" defaultMessage="ui.leaderboardWidget.podium.title" values={{period}} />
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="flex-end" className={classes.podium}>
          {podium.map((entry) => (
            <Stack key={entry.user.id} alignItems="center" className={classNames(classes.podiumItem, `${classes.podiumItem}-${entry.position}`)}>
              <Box className={classes.podiumAvatarWrap}>
                {entry.position === 1 && (
                  <Box
                    component="span"
                    className={classes.podiumCrown}
                    style={{maskImage: `url(${crownIcon})`, WebkitMaskImage: `url(${crownIcon})`}}
                  />
                )}
                <Avatar alt={entry.user.username} src={entry.user.avatar} className={classes.podiumAvatar} />
                <Box component="span" className={classes.podiumBadge}>
                  {entry.position}
                </Box>
              </Box>
              <Typography variant="body2" fontWeight={600} className={classes.podiumName}>
                {entry.user.real_name || entry.user.username}
              </Typography>
              <Typography variant="caption" className={classes.podiumScore}>
                <FormattedMessage
                  id="ui.leaderboardWidget.podium.score"
                  defaultMessage="ui.leaderboardWidget.podium.score"
                  values={{score: entry.total_score}}
                />
              </Typography>
            </Stack>
          ))}
        </Stack>
        {mode === 'full' && entries.length > 0 && (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.rankingHeader}>
              <Typography variant="h4" className={classes.rankingTitle}>
                <FormattedMessage id="ui.leaderboardWidget.ranking.title" defaultMessage="ui.leaderboardWidget.ranking.title" />
              </Typography>
            </Stack>
            <Stack spacing={1} className={classes.rankingList}>
              {entries.map((entry) => {
                const isMe = Boolean(scUserContext.user) && entry.user.id === scUserContext.user.id && entry.position <= RANKING_LIMIT;
                return (
                  <Stack
                    key={entry.user.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    className={classNames(classes.rankingItem, {[classes.rankingItemActive]: isMe})}>
                    <Typography variant="body2" className={classes.rankingPosition}>
                      {entry.position}
                    </Typography>
                    <Avatar alt={entry.user.username} src={entry.user.avatar} className={classes.rankingAvatar} />
                    <Typography variant="body2" fontWeight={isMe ? 600 : 400} className={classes.rankingName}>
                      {isMe ? (
                        <FormattedMessage id="ui.leaderboardWidget.ranking.you" defaultMessage="ui.leaderboardWidget.ranking.you" />
                      ) : (
                        entry.user.real_name || entry.user.username
                      )}
                    </Typography>
                    <Typography variant="body2" className={classes.rankingScore}>
                      <FormattedMessage
                        id="ui.leaderboardWidget.ranking.score"
                        defaultMessage="ui.leaderboardWidget.ranking.score"
                        values={{score: entry.total_score}}
                      />
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
            <Typography component="span" role="button" tabIndex={0} onClick={onSeeMoreClick} className={classes.seeMore}>
              <FormattedMessage id="ui.leaderboardWidget.ranking.seeMore" defaultMessage="ui.leaderboardWidget.ranking.seeMore" />
            </Typography>
          </>
        )}
      </CardContent>
    </Root>
  );
}
