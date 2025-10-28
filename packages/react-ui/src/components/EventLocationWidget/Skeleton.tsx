import {PREFIX} from './constants';
import Widget from '../Widget';
import {Box, CardContent, Skeleton, styled} from '@mui/material';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  map: `${PREFIX}-skeleton-map`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Group Info Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventLocationWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventLocationWidgetSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventLocationWidgetSkeleton-skeleton-root|Styles applied to the root element.|
 |root|.SCEventLocationWidgetSkeleton-skeleton-map|Styles applied to the map element.|
 *
 */

export default function EventLocationWidgetSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent>
        <Skeleton animation="wave" height={30} width="20%" variant="text" />
        <Box className={classes.map}>
          <Skeleton variant="rectangular" animation="wave" height="100%" width="100%" />
        </Box>
        <Skeleton animation="wave" height={20} width="30%" variant="text" />
        <Skeleton animation="wave" height={20} width="40%" variant="text" />
      </CardContent>
    </Root>
  );
}
