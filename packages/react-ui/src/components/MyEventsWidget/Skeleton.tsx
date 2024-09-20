import {Box, CardActions} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {PREFIX} from './constants';
import {SCEventTemplateType} from '../../types/event';
import {EventSkeleton} from '../Event';

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
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));
export default function MyEventsWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <Box padding="12px 16px">
        <Skeleton animation="wave" width="141px" height="33px" />
      </Box>
      <EventSkeleton template={SCEventTemplateType.DETAIL} elevation={0} square={true} actions={<></>} />
      <CardActions className={classes.actions}>
        <Skeleton animation="wave" variant="rounded" width="14px" height="14px" />
        <Skeleton animation="wave" width="52px" height="20px" />
        <Skeleton animation="wave" variant="rounded" width="14px" height="14px" />
      </CardActions>
    </Root>
  );
}
