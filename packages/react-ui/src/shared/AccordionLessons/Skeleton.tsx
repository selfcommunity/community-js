import {Box, Skeleton, styled} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  accordion: `${PREFIX}-accordion`,
  summary: `${PREFIX}-summary`,
  details: `${PREFIX}-details`,
  circle: `${PREFIX}-circle`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function AccordionLessonSkeleton() {
  return (
    <Root className={classes.root}>
      <Box className={classes.accordion}>
        <Box className={classes.summary}>
          <Skeleton animation="wave" variant="text" width="210px" height="21px" />
          <Skeleton animation="wave" variant="text" width="54px" height="21px" />
        </Box>
      </Box>
    </Root>
  );
}
