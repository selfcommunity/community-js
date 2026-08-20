import {CardContent, Skeleton, Stack, styled} from '@mui/material';
import Widget from '../Widget';
import {PREFIX} from './constants';
import {LeaderboardWidgetVariant} from './LeaderboardWidget';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  podiumHeader: `${PREFIX}-podium-header`,
  podium: `${PREFIX}-podium`,
  podiumItem: `${PREFIX}-podium-item`,
  rankingHeader: `${PREFIX}-ranking-header`,
  rankingList: `${PREFIX}-ranking-list`,
  rankingItem: `${PREFIX}-ranking-item`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface LeaderboardWidgetSkeletonProps {
  /**
   * The widget mode.
   * @default 'full'
   */
  mode?: LeaderboardWidgetVariant;
}

/**
 * > API documentation for the Community-JS Leaderboard Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LeaderboardWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLeaderboardWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLeaderboardWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function LeaderboardWidgetSkeleton({mode = 'full'}: LeaderboardWidgetSkeletonProps): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.podiumHeader}>
          <Skeleton animation="wave" height={28} width="50%" variant="rectangular" />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="flex-end" spacing={2} className={classes.podium}>
          {[1, 2, 3].map((item) => (
            <Stack key={item} spacing={1} alignItems="center" className={classes.podiumItem}>
              <Skeleton animation="wave" variant="circular" width={56} height={56} />
              <Skeleton animation="wave" height={16} width={60} variant="rectangular" />
              <Skeleton animation="wave" height={14} width={40} variant="rectangular" />
            </Stack>
          ))}
        </Stack>
        {mode === 'full' && (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.rankingHeader}>
              <Skeleton animation="wave" height={28} width="50%" variant="rectangular" />
            </Stack>
            <Stack spacing={1} className={classes.rankingList}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center" className={classes.rankingItem}>
                  <Skeleton animation="wave" variant="circular" width={36} height={36} />
                  <Skeleton animation="wave" height={16} width="60%" variant="rectangular" />
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Root>
  );
}
