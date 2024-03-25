import React, {useEffect, useMemo, useReducer} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Box, Button, ListItem, Typography} from '@mui/material';
import {SCGroupType} from '@selfcommunity/types';
import {http, EndpointType} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Skeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {PREFIX} from './constants';
import Group, {GroupProps} from '../Group';

const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupsProps {
  /**
   * Endpoint to call
   */
  endpoint: EndpointType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of users to show
   * @default false
   */
  limit?: number;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  GroupProps?: GroupProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Groups component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the follows of the given group.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Groups)

 #### Import

 ```jsx
 import {Groups} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroups` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroups-root|Styles applied to the root element.|
 |title|.SCGroups-title|Styles applied to the title element.|
 |noResults|.SCGroups-no-results|Styles applied to no results section.|
 |showMore|.SCGroups-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCGroups-dialog-root|Styles applied to the dialog root element.|
 |endMessage|.SCGroups-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function Groups(inProps: GroupsProps): JSX.Element {
  // PROPS
  const props: GroupsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    endpoint,
    autoHide = false,
    limit = 5,
    className,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    GroupProps = {},
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.GROUPS_LIST_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();

  // MEMO
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext.preferences]
  );

  // HOOKS
  // const theme = useTheme<SCThemeType>();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Initialize component
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        http
          .request({
            url: endpoint.url({limit}),
            method: endpoint.method
          })
          .then((payload: any) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload.data, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, endpoint, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if ((contentAvailability || (!contentAvailability && scUserContext.user?.id)) && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability]);

  useEffect(() => {
    if (state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: endpoint.url({offset: limit, limit: 10}),
          method: endpoint.method
        })
        .then((payload: any) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload.data});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.next, state.results.length, state.initialized, limit]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!endpoint || (!contentAvailability && !scUserContext.user)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user, endpoint, contentAvailability]);

  useEffect(() => {
    if (!endpoint || !scUserContext.user || !state.initialized) {
      return;
    }
  }, []);

  // HANDLERS
  // const handleNext = useMemo(
  //   () => (): void => {
  //     dispatch({type: actionWidgetTypes.LOADING_NEXT});
  //     http
  //       .request({
  //         url: state.next,
  //         method: endpoint
  //       })
  //       .then((res: AxiosResponse<any>) => {
  //         dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
  //       });
  //   },
  //   [dispatch, state.next, state.isLoadingNext, state.initialized]
  // );

  // RENDER
  if ((autoHide && !state.count && state.initialized) || (!contentAvailability && !scUserContext.user) || !endpoint) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.groupRequestsWidget.subtitle.noResults" defaultMessage="" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((group: SCGroupType) => (
              <ListItem key={group.id} className={classes.item}>
                <Group
                  elevation={1}
                  actions={<></>}
                  group={group}
                  groupId={group.id}
                  buttonProps={{onClick: () => console.log(group)}}
                  {...GroupProps}
                />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={() => console.log('load more')}>
              <FormattedMessage id="ui.groupRequestsWidget.button.showMore" defaultMessage="ui.groupRequestsWidget.button.showMore" />
            </Button>
          )}
        </React.Fragment>
      )}
    </>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
