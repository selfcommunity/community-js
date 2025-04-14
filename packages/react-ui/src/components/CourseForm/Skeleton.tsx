import {Skeleton, Stack, styled} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function CourseFormSkeleton() {
  return (
    <Root className={classes.root}>
      <Skeleton animation="wave" variant="rectangular" width="100%" height="103px" />
      <Skeleton animation="wave" variant="rectangular" width="100%" height="50px" />
      <Skeleton animation="wave" variant="rectangular" width="100%" height="50px" />
      <Skeleton animation="wave" variant="rectangular" width="100%" height="50px" />
      <Skeleton animation="wave" variant="text" width="86px" height="21px" />
      <Skeleton animation="wave" variant="rectangular" width="100%" height="236px" />
    </Root>
  );
}
