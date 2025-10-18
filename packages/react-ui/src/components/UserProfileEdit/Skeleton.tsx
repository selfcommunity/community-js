import {Box, Grid, styled, Skeleton} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS User Profile Edit Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileEditSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileEdit-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileEdit-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserProfileEditSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Grid container width="100%">
        <Grid>
          <Skeleton animation="wave" sx={{height: 20, width: '100%'}} />
          <Skeleton animation="wave" sx={{height: 20, width: '100%'}} />
        </Grid>
      </Grid>
    </Root>
  );
}
