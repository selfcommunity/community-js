import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden, Stack, useTheme} from '@mui/material';
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
  header: `${PREFIX}-header`,
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
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      justifyContent: 'right'
    },
    padding: theme.spacing(1, 5)
  },
  [`& .${classes.right}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      justifyContent: 'left'
    },
    padding: theme.spacing(1, 5)
  },
  [`& .${classes.header}`]: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    '& div': {
      maxWidth: 515
    }
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
 * > API documentation for the Community-JS CheckoutSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CheckoutSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCheckout-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCheckout-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CheckoutSkeleton(inProps): JSX.Element {
  const {className = {}, ...rest} = inProps;

  // HOOKS
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classNames(classes.root, className)} container {...rest}>
      <Grid container xs={12} className={classes.header}>
        <Grid item xs={12} md={6} className={classNames(classes.left, classes.paper)}>
          <Skeleton variant="rounded" height={150} width={'100%'} />
        </Grid>
        <Grid item xs={12} md={6} className={classes.right}>
          <Hidden mdDown>
            <Stack direction="column" spacing={2} pt={2}>
              <Skeleton variant="rounded" height={20} width={190} />
              <Skeleton variant="rounded" height={90} width={'100%'} />
            </Stack>
          </Hidden>
        </Grid>
      </Grid>
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
            <Skeleton variant="rounded" height={340} />
          </Hidden>
        </Box>
      </Grid>
    </Root>
  );
}
