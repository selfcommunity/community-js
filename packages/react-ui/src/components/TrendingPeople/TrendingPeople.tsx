import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget from '../Widget';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import User, {UserProps} from '../User';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Skeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import {SCOPE_SC_UI} from '../../constants/Errors';

const PREFIX = 'SCTrendingPeople';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  trendingUserItem: `${PREFIX}-trending-user-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.trendingUserItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface TrendingPeopleProps extends VirtualScrollerItemProps {
  /**
   * Category id
   * @default null
   */
  categoryId?: number;

  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;
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

/**
 * > API documentation for the Community-JS Trending People component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingPeople} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCTrendingPeople` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingPeople-root|Styles applied to the root element.|
 |title|.SCTrendingPeople-title|Styles applied to the title element.|
 |noResults|.SCTrendingPeople-no-results|Styles applied to no results section.|
 |trendingUserItem|.SCTrendingPeople-trending-user-item|Styles applied to the trending user item element.|
 |showMore|.SCTrendingPeople-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function TrendingPeople(inProps: TrendingPeopleProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: TrendingPeopleProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    categoryId,
    autoHide,
    className,
    UserProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    ...rest
  } = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.CategoryTrendingPeople.url({id: categoryId})}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.TRENDING_PEOPLE_TOOLS_STATE_CACHE_PREFIX_KEY, categoryId),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Fetches trending people list
   */
  const fetchTrendingPeople = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.CategoryTrendingPeople.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, []);
  /**
   * On mount, fetches trending people list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchTrendingPeople()
        .then((res: HttpResponse<any>) => {
          if (res.status < 300 && isMountedRef.current && !ignore) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data.results,
                count: data.count,
                next: data.next
              }
            });
          }
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [state.next]);

  /**
   * Handles followers counter update on follow/unfollow action.
   * @param user
   */
  function handleFollowersUpdate(user) {
    const newUsers = [...state.results];
    const index = newUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      if (user.connection_status === 'followed') {
        newUsers[index].followers_counter = user.followers_counter - 1;
        newUsers[index].connection_status = null;
      } else {
        newUsers[index].followers_counter = user.followers_counter + 1;
        newUsers[index].connection_status = 'followed';
      }
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: newUsers}
      });
    }
  }

  /**
   * Renders trending people list
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const p = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.trendingPeople.title" defaultMessage="ui.trendingPeople.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.trendingPeople.noResults" defaultMessage="ui.trendingPeople.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((user) => (
              <ListItem key={user.id}>
                <User
                  elevation={0}
                  user={user}
                  className={classes.trendingUserItem}
                  {...(followEnabled
                    ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                    : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                  {...UserProps}
                />
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      )}
      {limit < state.count && (
        <Button size="small" className={classes.showMore} onClick={() => setOpenTrendingPeopleDialog(true)}>
          <FormattedMessage id="ui.trendingPeople.button.showAll" defaultMessage="ui.trendingPeople.button.showAll" />
        </Button>
      )}
      {openTrendingPeopleDialog && (
        <BaseDialog
          title={<FormattedMessage defaultMessage="ui.trendingPeople.title" id="ui.trendingPeople.title" />}
          onClose={() => setOpenTrendingPeopleDialog(false)}
          open={openTrendingPeopleDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchTrendingPeople}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.trendingPeople.noMoreResults" defaultMessage="ui.trendingPeople.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((p) => (
                  <ListItem key={p.id}>
                    <User
                      elevation={0}
                      user={p}
                      className={classes.trendingUserItem}
                      {...(followEnabled
                        ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                        : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                      {...UserProps}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {p}
    </Root>
  );
}
