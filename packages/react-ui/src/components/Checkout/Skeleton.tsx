import {Box, Grid, Stack, Skeleton, styled} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';

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
  [`& .${classes.header}`]: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    '& span.MuiSkeleton-root': {
      maxWidth: 450
    }
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

  return (
    <Root className={classNames(classes.root, className)} container width="100%" {...rest}>
      <Grid size={{md: 6}} className={classNames(classes.left, classes.paper, classes.header)}>
        <Skeleton variant="rounded" height={150} width={'100%'} />
      </Grid>
      <Grid size={{md: 6}} className={classNames(classes.right, classes.header)}>
        <Stack sx={{display: {xs: 'none', md: 'flex'}}} direction="column" spacing={2} pt={2}>
          <Skeleton variant="rounded" height={20} width={190} />
          <Skeleton variant="rounded" height={90} width={'100%'} />
        </Stack>
      </Grid>
      <Grid size={{md: 6}} className={classNames(classes.left, classes.paper)}>
        <Box className={classes.content}>
          <Skeleton variant="rounded" height={30} width={140} />
          <br />
          <Skeleton variant="rounded" height={110} />
          <br />
          <Skeleton variant="rounded" height={150} />
          <Box sx={{display: {xs: 'none', md: 'block'}}}>
            <br />
            <Skeleton variant="rounded" height={200} />
          </Box>
        </Box>
      </Grid>
      <Grid size={{md: 6}} className={classes.right}>
        <Box className={classes.content}>
          <Skeleton variant="rounded" height={110} />
          <Box sx={{display: {xs: 'none', md: 'block'}}}>
            <br />
            <Skeleton variant="rounded" height={70} />
            <br />
            <Skeleton variant="rounded" height={340} />
          </Box>
        </Box>
      </Grid>
    </Root>
  );
}
