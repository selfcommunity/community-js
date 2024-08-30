import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, CardActions, CardContent, List, ListItem, Stack, Tab, Typography, useThemeProps } from '@mui/material';
import { styled } from '@mui/system';
import { Endpoints, EventService, http, SCPaginatedResponse } from '@selfcommunity/api-services';
import { SCCache, SCUserContextType, useSCFetchEvent, useSCUser } from '@selfcommunity/react-core';
import { SCEventType, SCUserType } from '@selfcommunity/types';
import { CacheStrategies, Logger } from '@selfcommunity/utils';
import { AxiosResponse } from 'axios';
import { SyntheticEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import 'swiper/css';
import { SCOPE_SC_UI } from '../../constants/Errors';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '../../constants/Pagination';
import BaseDialog, { BaseDialogProps } from '../../shared/BaseDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import { actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer } from '../../utils/widget';
import InviteEventButton from '../InviteEventButton';
import User, { UserProps, UserSkeleton } from '../User';
import Widget, { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import Skeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  tabsWrapper: `${PREFIX}-tabs-wrapper`,
  tabLabelWrapper: `${PREFIX}-tab-label-wrapper`,
  tabPanel: `${PREFIX}-tab-panel`,
  actions: `${PREFIX}-actions`,
  actionButton: `${PREFIX}-action-button`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})();

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})();

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
    endpointQueryParams = { limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET },
    cacheStrategy,
    dialogProps,
    ...rest
  } = props;

  // STATE
  const [partecipants, dispatchPartecipants] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_EVENTS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: DEFAULT_PAGINATION_LIMIT
    },
    stateWidgetInitializer
  );
  const [invited, dispatchInvited] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_EVENTS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: DEFAULT_PAGINATION_LIMIT
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [invitedNumber, setInvitedNumber] = useState(0);
  const [tabValue, setTabValue] = useState('1');

  const state = useMemo(() => (tabValue === '1' ? partecipants : invited), [tabValue, partecipants, invited]);
  const dispatch = useCallback(() => (tabValue === '1' ? dispatchPartecipants : dispatchInvited), [tabValue, dispatchPartecipants, dispatchInvited]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });

  const _initPartecipants = useCallback(() => {
    if (!partecipants.initialized && !partecipants.isLoadingNext) {
      dispatchPartecipants({ type: actionWidgetTypes.LOADING_NEXT });
      EventService.getUsersGoingToEvent(scEvent.id, { ...endpointQueryParams })
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatchPartecipants({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: { ...payload, initialized: true } });
        })
        .catch((error) => {
          dispatchPartecipants({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [partecipants.isLoadingNext, partecipants.initialized, dispatchPartecipants, scEvent]);

  const _initInvited = useCallback(() => {
    if (!invited.initialized && !invited.isLoadingNext && scUserContext.user?.id === scEvent.managed_by.id) {
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
        _initPartecipants();
        _initInvited();
      });

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent]);

  // HANDLERS
  /**
   * Handles pagination
   */
  const handleNext = useCallback(() => {
    dispatch({ type: actionWidgetTypes.LOADING_NEXT });
    http
      .request({
        url: state.next,
        method: Endpoints.UserSuggestion.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data });
      });
  }, [dispatch, state.next, state.isLoadingNext, state.initialized]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  const handleTabChange = useCallback((_evt: SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  }, []);

  if (!scEvent && !state.initialized) {
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
          <FormattedMessage id="ui.eventMembersWidget.invited" defaultMessage="ui.eventMembersWidget.invited" />
        </Typography>

        <TabContext value={tabValue}>
          <Box className={classes.tabsWrapper}>
            <TabList onChange={handleTabChange} textColor="secondary" indicatorColor="secondary" variant="fullWidth">
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Typography variant="h3">{partecipants.count}</Typography>
                    <Typography variant="subtitle2">
                      <FormattedMessage id="ui.eventMembersWidget.partecipants" defaultMessage="ui.eventMembersWidget.partecipants" />
                    </Typography>
                  </Stack>
                }
                value="1"
              />
              {invited && (
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
          </Box>
          <TabPanel value="1" className={classes.tabPanel}>
            <List>
              {partecipants.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User elevation={0} user={user} {...userProps} />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          {invited && (
            <TabPanel value="2" className={classes.tabPanel}>
              <List>
                {invited.results.map((user: SCUserType) => (
                  <ListItem key={user.id}>
                    <User
                      elevation={0}
                      user={user}
                      {...userProps}
                      actions={<InviteEventButton event={scEvent} user={scUserContext.user} setInvitedNumber={setInvitedNumber} />}
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          )}
        </TabContext>
      </CardContent>

      {state.count > state.visibleItems && (
        <CardActions className={classes.actions}>
          <Button onClick={handleToggleDialogOpen} className={classes.actionButton}>
            <Typography variant="caption">
              <FormattedMessage id="ui.eventMembersWidget.showAll" defaultMessage="ui.eventMembersWidget.showAll" />
            </Typography>
          </Button>
        </CardActions>
      )}

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.eventMembersWidget.title" id="ui.eventMembersWidget.title" />}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...dialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<UserSkeleton elevation={0} {...userProps} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.eventMembersWidget.noMoreResults" defaultMessage="ui.eventMembersWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User elevation={0} user={user} {...userProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </Root>
  );
}
