import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
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
import PeopleSuggestionSkeleton from './Skeleton';
import User, {UserProps} from '../User';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies} from '@selfcommunity/utils';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCPeopleSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  suggestedUserItem: `${PREFIX}-suggested-user-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.suggestedUserItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface PeopleSuggestionProps extends VirtualScrollerItemProps {
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
 *
 > API documentation for the Community-JS People Suggestion component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PeopleSuggestion} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPeopleSuggestion` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPeopleSuggestion-root|Styles applied to the root element.|
 |title|.SCPeopleSuggestion-title|Styles applied to the title element.|
 |suggestedUserItem|.SCPeopleSuggestion-suggested-user-item|Styles applied to the suggested user element.|
 |noResults|.SCPeopleSuggestion-no-results|Styles applied to the no results section.|
 |showMore|.SCPeopleSuggestion-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function PeopleSuggestion(inProps: PeopleSuggestionProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: PeopleSuggestionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide, className, UserProps = {}, onHeightChange, onStateChange, cacheStrategy = CacheStrategies.NETWORK_ONLY, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.UserSuggestion.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.PEOPLE_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateToolsInitializer
  );
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on user follow
   */
  function handleOnFollowConnectUser(user, follow) {
    dispatch({
      type: actionToolsTypes.SET_RESULTS,
      payload: {results: state.results.filter((u) => u.id !== user.id), count: state.count - 1}
    });
  }

  /**
   * Fetches user suggestion list
   */
  const fetchUserSuggestion = useMemo(
    () => (ignore) => {
      return http
        .request({
          url: Endpoints.UserSuggestion.url(),
          method: Endpoints.UserSuggestion.method
        })
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
          console.log(error);
        });
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  /**
   * Loads more people on "see more" button click
   */
  function loadPeople(n) {
    dispatch({type: actionToolsTypes.SET_VISIBLE_ITEMS, payload: {visibleItems: state.visibleItems + n}});
  }
  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, fetches people suggestion list
   */
  useEffect(() => {
    let ignore = false;
    if (state.isLoadingNext && scUserContext.user) {
      fetchUserSuggestion(ignore);

      return () => {
        ignore = true;
      };
    }
  }, [state.isLoadingNext, authUserId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  /**
   * Renders people suggestion list
   */
  if (state.isLoadingNext) {
    return <PeopleSuggestionSkeleton />;
  }
  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if ((autoHide && !state.count) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography className={classes.title} variant="h5">
          <FormattedMessage id="ui.peopleSuggestion.title" defaultMessage="ui.peopleSuggestion.title" />
        </Typography>
        {!state.count ? (
          <Typography className={classes.noResults} variant="body2">
            <FormattedMessage id="ui.peopleSuggestion.subtitle.noResults" defaultMessage="ui.peopleSuggestion.subtitle.noResults" />
          </Typography>
        ) : (
          <React.Fragment>
            <List>
              {state.results.slice(0, state.visibleItems).map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User
                    elevation={0}
                    user={user}
                    {...(followEnabled
                      ? {followConnectUserButtonProps: {onFollow: handleOnFollowConnectUser}}
                      : {followConnectUserButtonProps: {onChangeConnectionStatus: handleOnFollowConnectUser}})}
                    className={classes.suggestedUserItem}
                    {...UserProps}
                  />
                </ListItem>
              ))}
            </List>
            {state.visibleItems < state.results.length && (
              <Button className={classes.showMore} size="small" onClick={() => loadPeople(limit)}>
                <FormattedMessage id="ui.peopleSuggestion.button.showMore" defaultMessage="ui.peopleSuggestion.button.showMore" />
              </Button>
            )}
          </React.Fragment>
        )}
        {openPeopleSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
