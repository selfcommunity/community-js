import {Box, Skeleton, Stack} from '@mui/material';
import {PREFIX} from '../constants';

const classes = {
  header: `${PREFIX}-header`,
  img: `${PREFIX}-header-img`,
  outerWrapper: `${PREFIX}-header-outer-wrapper`,
  innerWrapper: `${PREFIX}-header-inner-wrapper`,
  iconWrapper: `${PREFIX}-header-icon-wrapper`
};

export default function HeaderSkeleton() {
  return (
    <Box className={classes.header}>
      <Skeleton animation="wave" variant="rectangular" className={classes.img} />
      <Skeleton animation="wave" variant="text" width="266px" height="25px" />

      <Stack className={classes.outerWrapper}>
        <Stack className={classes.innerWrapper}>
          {Array.from(new Array(2)).map((_, i) => (
            <Stack key={i} className={classes.iconWrapper}>
              <Skeleton animation="wave" variant="rectangular" width="20px" height="20px" />
              <Skeleton animation="wave" variant="text" width="50px" height="21px" />
            </Stack>
          ))}
        </Stack>

        <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />
      </Stack>
    </Box>
  );
}
