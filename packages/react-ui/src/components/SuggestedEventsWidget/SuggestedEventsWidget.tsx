import { Button, CardActions, CardContent, Typography, useThemeProps } from '@mui/material';
import { styled } from '@mui/system';
import { Endpoints, http, SCPaginatedResponse, SuggestionService } from '@selfcommunity/api-services';
import { Link, SCRoutes, SCRoutingContextType, useSCRouting } from '@selfcommunity/react-core';
import { SCEventType } from '@selfcommunity/types';
import { Logger } from '@selfcommunity/utils';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SCOPE_SC_UI } from '../../constants/Errors';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '../../constants/Pagination';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import { SCEventTemplateType } from '../../types/event';
import Event from '../Event';
import Widget, { WidgetProps } from '../Widget';
import Arrow from './Arrow';
import { PREFIX } from './constants';
import Skeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  swiper: `${PREFIX}-swiper`,
  swiperSlide: `${PREFIX}-swiper-slide`,
  swiperPrevArrow: `${PREFIX}-swiper-prev-arrow`,
  swiperNextArrow: `${PREFIX}-swiper-next-arrow`,
  event: `${PREFIX}-event`,
  actions: `${PREFIX}-actions`,
  actionButton: `${PREFIX}-action-button`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface SuggestedEventsWidgetProps extends WidgetProps {
  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function SuggestedEventsWidget(inProps: SuggestedEventsWidgetProps) {
  // PROPS
  const props: SuggestedEventsWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const { endpointQueryParams = { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET }, ...rest } = props;

  // STATE
  const [eventsData, setEventsData] = useState<SCPaginatedResponse<SCEventType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  useEffect(() => {
    SuggestionService.getEventSuggestion({ ...endpointQueryParams })
      .then((payload: SCPaginatedResponse<SCEventType>) => {
        setEventsData(payload);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, []);

  const handleReachEnd = useCallback(() => {
    if (eventsData.count > eventsData.results.length && eventsData.next) {
      setShowSkeleton(true);

      http
        .request({
          url: eventsData.next,
          method: Endpoints.GetEventSuggestedUsers.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCEventType>>) => {
          setEventsData(res.data);
          setShowSkeleton(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [eventsData]);

  // RENDER
  if (!eventsData && loading) {
    return <Skeleton />;
  }

  if (!eventsData) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="ui.suggestedEventsWidget.title" defaultMessage="ui.suggestedEventsWidget.title" />
        </Typography>

        <Swiper spaceBetween={8} slidesPerView="auto" grabCursor={true} modules={[Navigation]} onReachEnd={handleReachEnd} className={classes.swiper}>
          {(showSkeleton ? [...eventsData.results, undefined] : eventsData.results).map((event, i) => (
            <SwiperSlide key={i} className={classes.swiperSlide}>
              <Event event={event} template={SCEventTemplateType.PREVIEW} actions={<></>} variant="outlined" className={classes.event} />
            </SwiperSlide>
          ))}

          <Arrow className={classes.swiperPrevArrow} type="prev" currentItem={currentItem} setCurrentItem={setCurrentItem} />
          <Arrow className={classes.swiperNextArrow} type="next" currentItem={currentItem} setCurrentItem={setCurrentItem} />
        </Swiper>
      </CardContent>

      <CardActions className={classes.actions}>
        <Button component={Link} to={scRoutingContext.url(SCRoutes.EVENTS_SUGGESTED_ROUTE_NAME, {})} className={classes.actionButton}>
          <Typography variant="caption">
            <FormattedMessage id="ui.suggestedEventsWidget.showAll" defaultMessage="ui.suggestedEventsWidget.showAll" />
          </Typography>
        </Button>
      </CardActions>
    </Root>
  );
}
