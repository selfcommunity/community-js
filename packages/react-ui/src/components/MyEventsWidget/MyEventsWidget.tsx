import {Button, CardActions, Icon, IconButton, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Box, useThemeProps} from '@mui/system';
import {Endpoints, EventService, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {
  SCCache,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCEventSubscriptionStatusType, SCEventType, SCFeatureName} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {AxiosResponse} from 'axios';
import {useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {SCEventTemplateType} from '../../types/event';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Event from '../Event';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';

const classes = {
  root: `${PREFIX}-root`,
  titleWrapper: `${PREFIX}-title-wrapper`,
  imageWrapper: `${PREFIX}-image-wrapper`,
  image: `${PREFIX}-image`,
  content: `${PREFIX}-content`,
  nameWrapper: `${PREFIX}-name-wrapper`,
  name: `${PREFIX}-name`,
  user: `${PREFIX}-user`,
  firstDivider: `${PREFIX}-first-divider`,
  secondDivider: `${PREFIX}-second-divider`,
  actions: `${PREFIX}-actions`,
  actionButton: `${PREFIX}-action-button`,
  arrows: `${PREFIX}-arrows`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface MyEventsWidgetProps extends WidgetProps {
  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0, subscription_status: 'going'}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function MyEventsWidget(inProps: MyEventsWidgetProps) {
  // PROPS
  const props: MyEventsWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // CONST
  const {
    endpointQueryParams = {
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: DEFAULT_PAGINATION_OFFSET,
      subscription_status: SCEventSubscriptionStatusType.GOING
    },
    cacheStrategy,
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_EVENTS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: 1
    },
    stateWidgetInitializer
  );
  const [eventIndex, setEventIndex] = useState<number>(0);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {features}: SCPreferencesContextType = useSCPreferences();
  const eventsEnabled = useMemo(() => features && features.includes(SCFeatureName.EVENT) && features.includes(SCFeatureName.TAGGING), [features]);

  // REFS
  const updatesSubscription = useRef(null);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      EventService.getUserEvents({...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCEventType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, dispatch]);

  const _fetchNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});
    http
      .request({
        url: state.next,
        method: Endpoints.GetUserEvents.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCEventType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        setEventIndex((index) => index + 1);
      })
      .catch((error) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [dispatch, state.next]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (eventsEnabled && scUserContext.user) {
      _t = setTimeout(_initComponent);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, eventsEnabled]);

  const handlePrev = useCallback(() => {
    setEventIndex(eventIndex - 1);
  }, [eventIndex]);

  const handleNext = useCallback(() => {
    if (eventIndex < state.results.length - 1) {
      setEventIndex(eventIndex + 1);
    } else {
      _fetchNext();
    }
  }, [eventIndex, state.results]);

  /**
   * Subscriber for pubsub callback
   */
  const onDeleteEventHandler = useCallback(
    (_msg: string, deleted: number) => {
      const _events = [...state.results];
      if (_events.some((e) => e.id === deleted)) {
        const updatedEvents = _events.filter((e) => e.id !== deleted);
        dispatch({
          type: actionWidgetTypes.SET_RESULTS,
          payload: {results: updatedEvents}
        });
      }
    },
    [state.results]
  );

  /**
   * On mount, subscribe to receive event updates (only delete)
   */
  useEffect(() => {
    if (state.results) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.DELETE}`, onDeleteEventHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [state.results]);

  // RENDER
  if (!eventsEnabled || (state.initialized && state.count === 0)) {
    return <HiddenPlaceholder />;
  }

  if (!state.initialized || state.isLoadingNext) {
    return <Skeleton />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <Box className={classes.titleWrapper}>
        <Typography variant="h5">
          <FormattedMessage id="ui.myEventsWidget.title" defaultMessage="ui.myEventsWidget.title" />
        </Typography>
      </Box>
      <Event event={state.results[eventIndex]} template={SCEventTemplateType.DETAIL} actions={<></>} elevation={0} square={true} />
      <CardActions className={classes.actions}>
        <IconButton size="small" disabled={eventIndex === 0} className={classes.arrows} onClick={handlePrev}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <Button href={scRoutingContext.url(SCRoutes.EVENTS_ROUTE_NAME, {})} className={classes.actionButton}>
          <Typography variant="caption">
            <FormattedMessage id="ui.myEventsWidget.showAll" defaultMessage="ui.myEventsWidget.showAll" />
          </Typography>
        </Button>
        <IconButton size="small" disabled={eventIndex === state.count - 1} className={classes.arrows} onClick={handleNext}>
          <Icon>chevron_right</Icon>
        </IconButton>
      </CardActions>
    </Root>
  );
}
