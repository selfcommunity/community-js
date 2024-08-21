import { AvatarGroup, Box, CardActions, CardContent, Divider, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  calendar: `${PREFIX}-calendar`,
  content: `${PREFIX}-content`,
  firstDivider: `${PREFIX}-first-divider`,
  secondDivider: `${PREFIX}-second-divider`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(({ theme }) => ({
  [`& .${classes.calendar}`]: {
    position: 'absolute',
    bottom: '-36px',
    left: '24px',
    boxShadow: '0px 3px 8px #00000040'
  },

  [`& .${classes.content}`]: {
    padding: `52px ${theme.spacing(3)} 0 !important`,

    [`& .${classes.firstDivider}`]: {
      marginTop: '18px',
      marginBottom: '16px'
    },

    [`& .${classes.secondDivider}`]: {
      marginTop: '16px',
      marginBottom: '18px'
    }
  },

  [`& .${classes.actions}`]: {
    padding: `0 ${theme.spacing(3)} 18px`,
    justifyContent: 'center',
    gap: '56px'
  }
}));

export default function MyEventsWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <Box padding="12px 16px">
        <Skeleton animation="wave" width="141px" height="23px" />
      </Box>

      <Box position="relative">
        <Skeleton variant="rectangular" animation="wave" width="100%" height="170px" />
        <Skeleton className={classes.calendar} variant="rounded" animation="wave" width="60px" height="60px" />
      </Box>

      <CardContent className={classes.content}>
        <Skeleton animation="wave" width="26%" height="30px" />

        <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
          <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
          <Skeleton animation="wave" width="229px" height="20px" />
        </Stack>

        <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
          <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
          <Skeleton animation="wave" width="124px" height="20px" />
        </Stack>

        <Stack direction="row" alignItems="center" gap="8px" marginBottom="14px">
          <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
          <Skeleton animation="wave" width="27%" height="20px" />
        </Stack>

        <Stack direction="row" gap="8px">
          <Skeleton animation="wave" variant="circular" width="36px" height="36px" />
          <Stack gap="1px">
            <Skeleton animation="wave" width="75px" height="15px" />
            <Skeleton animation="wave" width="86px" height="16px" />
          </Stack>
        </Stack>

        <Divider className={classes.firstDivider} />

        <Stack direction="row" gap="8px" alignItems="center">
          <Skeleton animation="wave" width="68px" height="20px" />
          <AvatarGroup>
            <Skeleton animation="wave" variant="circular" width="24px" height="24px" />
            <Skeleton animation="wave" variant="circular" width="24px" height="24px" />
            <Skeleton animation="wave" variant="circular" width="24px" height="24px" />
            <Skeleton animation="wave" variant="circular" width="24px" height="24px" />
          </AvatarGroup>
        </Stack>

        <Divider className={classes.secondDivider} />
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" variant="rounded" width="14px" height="14px" />
        <Skeleton animation="wave" width="52px" height="20px" />
        <Skeleton animation="wave" variant="rounded" width="14px" height="14px" />
      </CardActions>
    </Root>
  );
}
