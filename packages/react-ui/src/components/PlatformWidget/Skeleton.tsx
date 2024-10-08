import React from 'react';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import Widget from '../Widget';
import {Grid, Stack} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  title: `${PREFIX}-skeleton-title`,
  content: `${PREFIX}-skeleton-content`,
  actions: `${PREFIX}-skeleton-actions`,
  tutorial: `${PREFIX}-skeleton-tutorial`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Platform Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PlatformWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPlatformWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPlatformWidget-skeleton-root|Styles applied to the root element.|
 *
 */

export default function PlatformWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <Grid container justifyContent="center" className={classes.content}>
        <Grid item xs={12} className={classes.title}>
          <Skeleton animation="wave" height={25} width={170} />
        </Grid>
        <Grid item xs={12} className={classes.actions}>
          <Skeleton animation="wave" height={35} width={110} />
          <Skeleton animation="wave" height={35} width={110} />
          <Skeleton animation="wave" height={35} width={110} />
        </Grid>
        <Grid item xs={12} justifyContent="center" alignItems="center" className={classes.tutorial}>
          <Skeleton animation="wave" variant="circular" width={25} height={25} />
        </Grid>
      </Grid>
    </Root>
  );
}
