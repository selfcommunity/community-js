import { Box, CardContent, CardHeader, Divider } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function EventMediaWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardHeader title={<Skeleton animation="wave" width="50px" height="23px" />} />
      <Divider />
      <CardContent>
        <Box display="grid" gap="5px" gridTemplateColumns="repeat(3, 1fr)">
          {Array.from(Array(9)).map((_, i) => (
            <Skeleton key={i} variant="rectangular" animation="wave" width="100%" sx={{ paddingBottom: '100%' }} />
          ))}
        </Box>
      </CardContent>
    </Root>
  );
}
