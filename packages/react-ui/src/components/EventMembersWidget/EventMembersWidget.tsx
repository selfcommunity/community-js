import { TabContext, TabList, TabPanel } from '@mui/lab';
import { CardContent, Stack, Tab, Typography, useThemeProps } from '@mui/material';
import { styled } from '@mui/system';
import { EventService, SCPaginatedResponse } from '@selfcommunity/api-services';
import { SCCache, SCUserContextType, useSCFetchEvent, useSCUser } from '@selfcommunity/react-core';
import { SCEventType, SCUserType } from '@selfcommunity/types';
import { CacheStrategies, Logger } from '@selfcommunity/utils';
import { SyntheticEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import 'swiper/css';
import { SCOPE_SC_UI } from '../../constants/Errors';
import { DEFAULT_PAGINATION_OFFSET } from '../../constants/Pagination';
import { BaseDialogProps } from '../../shared/BaseDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import { actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer } from '../../utils/widget';
import { UserProps } from '../User';
import Widget, { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import Skeleton from './Skeleton';
import TabContentComponent from './TabContentComponent';

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
    endpointQueryParams = { limit: 5, offset: DEFAULT_PAGINATION_OFFSET },
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
  const [invitedNumber, setInvitedNumber] = useState(0);
  const [tabValue, setTabValue] = useState('1');
  const [refresh, setRefresh] = useState(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });

  // CONSTS
  const hasAllow = useMemo(() => scUserContext.user?.id === scEvent?.managed_by.id, [scUserContext, scEvent]);
  const title = useMemo(() => (tabValue === '1' ? 'ui.eventMembersWidget.participants' : 'ui.eventMembersWidget.invited'), [tabValue]);

  // CALLBACKS
  const _initParticipants = useCallback(() => {
    if (!participants.initialized && !participants.isLoadingNext) {
      dispatchParticipants({ type: actionWidgetTypes.LOADING_NEXT });

      EventService.getUsersGoingToEvent(scEvent.id, { ...endpointQueryParams })
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchParticipants({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: { ...payload, initialized: true } });
        })
        .catch((error) => {
          dispatchParticipants({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [participants.isLoadingNext, participants.initialized, dispatchParticipants, scEvent]);

  const _initInvited = useCallback(() => {
    if (!invited.initialized && !invited.isLoadingNext && hasAllow) {
      dispatchInvited({ type: actionWidgetTypes.LOADING_NEXT });

      EventService.getEventInvitedUsers(scEvent.id, { ...endpointQueryParams })
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchInvited({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: { ...payload, initialized: true } });
          setInvitedNumber(payload.count);
        })
        .catch((error) => {
          dispatchInvited({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [invited.isLoadingNext, invited.initialized, dispatchInvited, scUserContext.user, scEvent]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && scEvent) {
      _t = setTimeout(() => {
        if (refresh) {
          _initInvited();
          setRefresh(false);
        } else {
          _initParticipants();
          _initInvited();
        }
      });

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent, refresh]);

  // HANDLERS
  const handleTabChange = useCallback((_evt: SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  }, []);

  if (!scEvent && !participants.initialized) {
    return <Skeleton />;
  }

  // RENDER
  if (!scEvent) {
    return <HiddenPlaceholder />;
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
                  <Typography variant="h3">{participants.count}</Typography>
                  <Typography variant="subtitle2">
                    <FormattedMessage id="ui.eventMembersWidget.participants" defaultMessage="ui.eventMembersWidget.participants" />
                  </Typography>
                </Stack>
              }
              value="1"
            />
            {hasAllow && (
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Typography variant="h3">{invitedNumber}</Typography>
                    <Typography variant="subtitle2">
                      <FormattedMessage id="ui.eventMembersWidget.invited" defaultMessage="ui.eventMembersWidget.invited" />
                    </Typography>
                  </Stack>
                }
                value="2"
              />
            )}
          </TabList>
          <TabPanel value="1" className={classes.tabPanel}>
            <TabContentComponent state={participants} dispatch={dispatchParticipants} userProps={userProps} dialogProps={dialogProps} />
          </TabPanel>
          {hasAllow && (
            <TabPanel value="2" className={classes.tabPanel}>
              <TabContentComponent
                state={invited}
                dispatch={dispatchInvited}
                userProps={userProps}
                dialogProps={dialogProps}
                actionProps={{
                  scEvent,
                  setInvitedNumber
                }}
                setRefresh={setRefresh}
              />
            </TabPanel>
          )}
        </TabContext>
      </CardContent>
    </Root>
  );
}
