import {TabContext, TabList, TabPanel} from '@mui/lab';
import {CardContent, Stack, Tab, Typography, useThemeProps} from '@mui/material';
import {styled} from '@mui/system';
import {EventService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCache, SCUserContextType, useSCFetchEvent, useSCUser} from '@selfcommunity/react-core';
import {SCEventType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SyntheticEvent, useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import 'swiper/css';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {BaseDialogProps} from '../../shared/BaseDialog';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {UserProps} from '../User';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';
import TabContentComponent from './TabContentComponent';
import {TabContentEnum, TabContentType} from './types';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  tabsWrapper: `${PREFIX}-tabs-wrapper`,
  tabLabelWrapper: `${PREFIX}-tab-label-wrapper`,
  tabPanel: `${PREFIX}-tab-panel`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EventMembersWidgetProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of event object
   * @default null
   */
  eventId?: number;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  userProps?: UserProps;

  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to users suggestion dialog
   * @default {}
   */
  dialogProps?: BaseDialogProps;

  /**
   * Limit items
   */
  limit?: number;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function EventMembersWidget(inProps: EventMembersWidgetProps) {
  // PROPS
  const props: EventMembersWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    event,
    eventId,
    userProps = {},
    endpointQueryParams = {limit: 5, offset: DEFAULT_PAGINATION_OFFSET},
    cacheStrategy,
    dialogProps,
    limit = 5,
    ...rest
  } = props;

  // STATE
  const [participants, dispatchParticipants] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_PARTECIPANTS_EVENTS_STATE_CACHE_PREFIX_KEY, eventId || event.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [invited, dispatchInvited] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_INVITED_EVENTS_STATE_CACHE_PREFIX_KEY, eventId || event.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [requests, dispatchRequests] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_REQUESTS_EVENTS_STATE_CACHE_PREFIX_KEY, eventId || event.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [participantsCount, setParticipantsCount] = useState(participants.count);
  const [invitedCount, setInvitedCount] = useState(invited.count);
  const [requestsCount, setRequestsCount] = useState(requests.count);
  const [requestsUsers, setRequestsUsers] = useState<SCUserType[]>(requests.results);
  const [tabValue, setTabValue] = useState<TabContentType>(TabContentEnum.PARTICIPANTS);
  const [refresh, setRefresh] = useState<TabContentType | null>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  // CONSTS
  const hasAllow = useMemo(() => scUserContext.user?.id === scEvent?.managed_by.id, [scUserContext, scEvent]);
  const title = useMemo(() => {
    switch (tabValue) {
      case TabContentEnum.REQUESTS:
        return 'ui.eventMembersWidget.requests';
      case TabContentEnum.INVITED:
        return 'ui.eventMembersWidget.invited';
      case TabContentEnum.PARTICIPANTS:
      default:
        return 'ui.eventMembersWidget.participants';
    }
  }, [tabValue]);

  // CALLBACKS
  const _initParticipants = useCallback(() => {
    if (!participants.initialized && !participants.isLoadingNext) {
      dispatchParticipants({type: actionWidgetTypes.LOADING_NEXT});

      EventService.getUsersGoingToEvent(scEvent.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchParticipants({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          setParticipantsCount(payload.count);
        })
        .catch((error) => {
          dispatchParticipants({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [participants.isLoadingNext, participants.initialized, scEvent, endpointQueryParams, dispatchParticipants, setParticipantsCount]);

  const _initInvited = useCallback(() => {
    if (!invited.initialized && !invited.isLoadingNext && hasAllow) {
      dispatchInvited({type: actionWidgetTypes.LOADING_NEXT});

      EventService.getEventInvitedUsers(scEvent.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchInvited({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          setInvitedCount(payload.count);
        })
        .catch((error) => {
          dispatchInvited({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [invited.isLoadingNext, invited.initialized, scEvent, hasAllow, endpointQueryParams, dispatchInvited, setInvitedCount]);

  const _initRequests = useCallback(() => {
    if (!requests.initialized && !requests.isLoadingNext && hasAllow) {
      dispatchRequests({type: actionWidgetTypes.LOADING_NEXT});

      EventService.getEventWaitingApprovalSubscribers(scEvent.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchRequests({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          setRequestsCount(payload.count);
          setRequestsUsers(payload.results);
        })
        .catch((error) => {
          dispatchRequests({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [requests.isLoadingNext, requests.initialized, scEvent, hasAllow, endpointQueryParams, dispatchRequests, setRequestsCount, setRequestsUsers]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;
    if (scUserContext.user && scEvent) {
      _t = setTimeout(() => {
        if (refresh === TabContentEnum.PARTICIPANTS) {
          _initParticipants();
          setRefresh(null);
        } else if (refresh === TabContentEnum.INVITED) {
          _initInvited();
          setRefresh(null);
        } else {
          _initParticipants();
          _initInvited();
          _initRequests();
        }
      });
      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent, refresh, _initParticipants, _initInvited, _initRequests]);

  useEffect(() => {
    if (participants.initialized && scEvent && Boolean((eventId !== undefined && scEvent.id !== eventId) || (event && scEvent.id !== event.id))) {
      dispatchParticipants({type: actionWidgetTypes.RESET, payload: {}});
      dispatchRequests({type: actionWidgetTypes.RESET, payload: {}});
      dispatchInvited({type: actionWidgetTypes.RESET, payload: {}});
    }
  }, [participants.initialized, scEvent, eventId, event, dispatchParticipants, dispatchInvited, dispatchRequests]);

  // HANDLERS
  const handleTabChange = useCallback(
    (_evt: SyntheticEvent, newTabValue: TabContentType) => {
      setTabValue(newTabValue);
    },
    [setTabValue]
  );

  const handleRefresh = useCallback(
    (_tabValue: TabContentType) => {
      if (_tabValue === TabContentEnum.PARTICIPANTS) {
        dispatchParticipants({type: actionWidgetTypes.RESET});
      } else if (_tabValue === TabContentEnum.INVITED) {
        dispatchInvited({type: actionWidgetTypes.RESET});
      }

      setRefresh(_tabValue);
    },
    [dispatchParticipants, dispatchInvited, setRefresh]
  );

  if (!scUserContext.user) {
    return <HiddenPlaceholder />;
  }

  if (
    !scEvent ||
    !participants.initialized ||
    (scEvent && ((eventId !== undefined && scEvent.id !== eventId) || (event && scEvent.id !== event.id))) ||
    (tabValue === TabContentEnum.PARTICIPANTS && participants.isLoadingNext && !participants.initialized)
  ) {
    return <Skeleton />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id={title} defaultMessage={title} />
        </Typography>

        <TabContext value={tabValue}>
          <TabList className={classes.tabsWrapper} onChange={handleTabChange} textColor="primary" indicatorColor="primary" variant="fullWidth">
            <Tab
              label={
                <Stack className={classes.tabLabelWrapper}>
                  <Typography variant="h3">{participantsCount}</Typography>
                  <Typography variant="subtitle2">
                    <FormattedMessage id="ui.eventMembersWidget.participants" defaultMessage="ui.eventMembersWidget.participants" />
                  </Typography>
                </Stack>
              }
              value={TabContentEnum.PARTICIPANTS}
            />
            {hasAllow && (
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Typography variant="h3">{invitedCount}</Typography>
                    <Typography variant="subtitle2">
                      <FormattedMessage id="ui.eventMembersWidget.invited" defaultMessage="ui.eventMembersWidget.invited" />
                    </Typography>
                  </Stack>
                }
                value={TabContentEnum.INVITED}
              />
            )}
            {hasAllow && (
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Typography variant="h3">{requestsCount}</Typography>
                    <Typography variant="subtitle2">
                      <FormattedMessage id="ui.eventMembersWidget.requests" defaultMessage="ui.eventMembersWidget.requests" />
                    </Typography>
                  </Stack>
                }
                value={TabContentEnum.REQUESTS}
              />
            )}
          </TabList>
          <TabPanel value={TabContentEnum.PARTICIPANTS} className={classes.tabPanel}>
            <TabContentComponent
              tabValue={TabContentEnum.PARTICIPANTS}
              state={participants}
              dispatch={dispatchParticipants}
              userProps={userProps}
              dialogProps={dialogProps}
              handleRefresh={handleRefresh}
            />
          </TabPanel>
          {hasAllow && (
            <TabPanel value={TabContentEnum.INVITED} className={classes.tabPanel}>
              <TabContentComponent
                tabValue={TabContentEnum.INVITED}
                state={invited}
                dispatch={dispatchInvited}
                userProps={userProps}
                dialogProps={dialogProps}
                actionProps={{
                  scEvent,
                  setCount: setInvitedCount
                }}
                handleRefresh={handleRefresh}
              />
            </TabPanel>
          )}
          {hasAllow && (
            <TabPanel value={TabContentEnum.REQUESTS} className={classes.tabPanel}>
              <TabContentComponent
                tabValue={TabContentEnum.REQUESTS}
                state={requests}
                dispatch={dispatchRequests}
                userProps={userProps}
                dialogProps={dialogProps}
                actionProps={{
                  scEvent,
                  count: requestsCount,
                  setCount: setRequestsCount,
                  users: requestsUsers,
                  setUsers: setRequestsUsers
                }}
                handleRefresh={handleRefresh}
              />
            </TabPanel>
          )}
        </TabContext>
      </CardContent>
    </Root>
  );
}
