import { CardActions, CardContent, Divider, Skeleton, Stack } from '@mui/material';
import { styled } from '@mui/system';
import { Fragment } from 'react';
import 'swiper/css';
import { EventSkeleton } from '../Event';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`,
  user: `${PREFIX}-user`,
  eventWrapper: `${PREFIX}-event-wrapper`,
  event: `${PREFIX}-event`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function RelatedEventsWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        {/* <UserSkeleton className={classes.user} elevation={0} /> */}

        <Stack className={classes.eventWrapper}>
          {[1, 2, 3, 4].map((_event, i, array) => (
            <Fragment key={i}>
              <EventSkeleton elevation={0} className={classes.event} />
              {i < array.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Stack>
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" width="52px" height="20px" />
      </CardActions>
    </Root>
  );
}
