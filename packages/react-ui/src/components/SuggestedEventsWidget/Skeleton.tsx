import { CardActions, CardContent, Skeleton } from '@mui/material';
import { styled } from '@mui/system';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SCEventTemplateType } from '../../types/event';
import { EventSkeleton } from '../Event';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  swiperSlide: `${PREFIX}-swiper-slide`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function SuggestedEventsWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Skeleton className={classes.title} animation="wave" width="141px" height="23px" />

        <Swiper spaceBetween={8} slidesPerView="auto">
          {[1, 2, 3, 4, 5, 6, 7].map((_element, i) => (
            <SwiperSlide key={i} className={classes.swiperSlide}>
              <EventSkeleton template={SCEventTemplateType.PREVIEW} variant="outlined" actions={<></>} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" width="52px" height="20px" />
      </CardActions>
    </Root>
  );
}
