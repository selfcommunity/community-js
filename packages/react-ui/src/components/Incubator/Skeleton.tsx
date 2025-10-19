import Widget from '../Widget';
import {Button, CardActions, CardContent, Grid, Typography, styled, Skeleton} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  progressBar: `${PREFIX}-progress-bar`,
  action: `${PREFIX}-action`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Incubator Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {IncubatorSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCIncubator-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubator-skeleton-root|Styles applied to the root element.|
 |primary|.SCIncubator-primary|Styles applied to the primary text element.|
 |secondary|.SCIncubator-secondary|Styles applied to the secondary text element.|
 |progressBar|.SCIncubator-progress-bar|Styles applied to the progress bar section.|
 |action|.SCIncubator-action|Styles applied to the action button element.|
 *
 */
export default function IncubatorSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <Typography className={classes.primary}>
          <Skeleton animation="wave" height={20} width="40%" variant="text" />
        </Typography>
        <Typography className={classes.secondary}>
          <Skeleton animation="wave" height={10} width="50%" variant="text" />
          <Skeleton animation="wave" height={10} width="80%" variant="text" />
        </Typography>
        <Grid container width="100%" spacing={1} className={classes.progressBar}>
					<Grid size="grow">
            <Skeleton animation="wave" height={20} width="100%" variant="rectangular" />
          </Grid>
          <Grid size="grow">
            <Skeleton animation="wave" height={10} width="100%" variant="text" />
          </Grid>
          <Grid size="grow">
            <Skeleton animation="wave" height={10} width="100%" variant="text" />
          </Grid>
          <Grid size="grow">
            <Skeleton animation="wave" height={10} width="100%" variant="text" />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.action}>
        <Button disabled variant="outlined" size="small">
          <Skeleton animation="wave" height={20} width={50} variant="text" />
        </Button>
      </CardActions>
    </Root>
  );
}
