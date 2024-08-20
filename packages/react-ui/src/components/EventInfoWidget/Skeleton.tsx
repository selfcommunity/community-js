import { CardContent, Skeleton, Stack, styled } from '@mui/material';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.root
})();

export default function EventInfoWigetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Stack direction="row" alignItems="center" gap="8px" marginBottom="8px">
          <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
          <Skeleton animation="wave" width="184px" height="21px" />
        </Stack>

        <Skeleton animation="wave" width="100%" />
        <Skeleton animation="wave" width="100%" />
        <Skeleton animation="wave" width="50%" />

        <Stack gap="16px" marginTop="24px">
          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="223px" height="21px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="223px" height="21px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="223px" height="21px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="223px" height="21px" />
          </Stack>
        </Stack>
      </CardContent>
    </Root>
  );
}
