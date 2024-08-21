import { Box, CardActions, CardContent, Divider } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  calendar: `${PREFIX}-calendar`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  spacing: `${PREFIX}-spacing`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})();

export default function CreateEventWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <Box position="relative">
        <Skeleton variant="rectangular" animation="wave" width="100%" height="110px" />
        <Skeleton className={classes.calendar} variant="rounded" animation="wave" width="50px" height="50px" />
      </Box>

      <CardContent className={classes.content}>
        <Skeleton className={classes.title} animation="wave" width="26%" height="30px" />
        <Skeleton className={classes.spacing} animation="wave" width="100%" height="20px" />

        <Divider className={classes.spacing} />
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" variant="rounded" width="138px" height="36px" />
      </CardActions>
    </Root>
  );
}
