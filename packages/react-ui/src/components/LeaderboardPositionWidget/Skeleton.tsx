import {CardContent, Skeleton, Stack, styled} from '@mui/material';
import Widget from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  header: `${PREFIX}-header`,
  user: `${PREFIX}-user`,
  footer: `${PREFIX}-footer`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Leaderboard Position Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LeaderboardPositionWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLeaderboardPositionWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLeaderboardPositionWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function LeaderboardPositionWidgetSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent>
        <Skeleton animation="wave" height={28} width="50%" variant="rectangular" className={classes.header} />
        <Stack direction="row" spacing={1.5} alignItems="center" className={classes.user}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          <Skeleton animation="wave" height={20} width="60%" variant="rectangular" />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={classes.footer}>
          <Skeleton animation="wave" height={32} width={40} variant="rectangular" />
          <Skeleton animation="wave" height={20} width={50} variant="rectangular" />
        </Stack>
      </CardContent>
    </Root>
  );
}
