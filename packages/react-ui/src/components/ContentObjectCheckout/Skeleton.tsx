import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden, useTheme} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';
import {SCThemeType} from '@selfcommunity/react-core';
import Skeleton from '@mui/material/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`,
  content: `${PREFIX}-content`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(({theme}) => ({
  height: '100%',
  [`& .${classes.paper}`]: {
    filter: 'drop-shadow(0 0 20px #00000040)'
  },
  [`& .${classes.left}`]: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      justifyContent: 'right'
    },
    padding: theme.spacing(5)
  },
  [`& .${classes.right}`]: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      justifyContent: 'left'
    },
    padding: theme.spacing(5)
  },
  [`& .${classes.content}`]: {
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingTop: 50
    },
    maxWidth: 450,
    flexGrow: 1
  }
}));

/**
 * > API documentation for the Community-JS ContentObjectProductsSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ContentObjectProductsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCContentObjectProductsSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCContentObjectProductsSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function ContentObjectCheckoutSkeleton(inProps): JSX.Element {
  const {className = {}, ...rest} = inProps;

  // HOOKS
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classNames(classes.root, className)} container {...rest}>
      <Grid item xs={12} md={6} className={classNames(classes.left, classes.paper)}>
        <Box className={classes.content}>
          <Skeleton variant="rounded" height={30} width={140} />
          <br />
          <Skeleton variant="rounded" height={110} />
          <br />
          <Skeleton variant="rounded" height={150} />
          <Hidden mdDown>
            <br />
            <Skeleton variant="rounded" height={200} />
            <br />
            <Skeleton variant="rounded" height={170} />
          </Hidden>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} className={classes.right}>
        <Box className={classes.content}>
          <Skeleton variant="rounded" height={110} />
          <Hidden mdDown>
            <br />
            <Skeleton variant="rounded" height={70} />
            <br />
            <Skeleton variant="rounded" height={250} />
          </Hidden>
          <br />
          <Skeleton variant="rounded" height={250} />
        </Box>
      </Grid>
    </Root>
  );
}
