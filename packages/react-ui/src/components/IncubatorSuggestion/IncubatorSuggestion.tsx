import React, {useEffect, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, ListItem, useMediaQuery, useTheme} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCUserContextType, useIsComponentMountedRef, useSCUser} from '@selfcommunity/react-core';
import {SCIncubatorType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Incubator, {IncubatorProps} from '../Incubator';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import IncubatorDetail from '../IncubatorDetail';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCIncubatorSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  incubatorItem: `${PREFIX}-incubator-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  '& .MuiListItem-root': {
    display: 'block',
    padding: 0
  },
  ' & .MuiCardContent-root': {
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  }
}));

export interface IncubatorSuggestionProps extends VirtualScrollerItemProps {
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
   * Props to spread to single incubator object
   * @default {}
   */
  IncubatorProps?: IncubatorProps;
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
 > API documentation for the Community-JS Incubator Suggestion component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {IncubatorSuggestion} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCIncubatorSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSuggestion-root|Styles applied to the root element.|
 |title|.SCIncubatorSuggestion-title|Styles applied to the title element.|
 |incubatorItem|.SCIncubatorSuggestion-incubator-item|Styles applied to the incubator item element.|
 |noResults|.SCIncubatorSuggestion-no-results|Styles applied to the no results section.|
 |showMore|.SCIncubatorSuggestion-show-more|Styles applied to the show more button element.|


 * @param inProps
 */
export default function IncubatorSuggestion(inProps: IncubatorSuggestionProps): JSX.Element {
  // CONST
  const limit = 2;

  // PROPS
  const props: IncubatorSuggestionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = true,
    className,
    IncubatorProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    ...rest
  } = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.GetIncubatorSuggestion.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.INCUBATOR_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openIncubatorsDialog, setOpenIncubatorsDialog] = useState<boolean>(false);
  const [openIncubatorDetailDialog, setOpenIncubatorDetailDialog] = useState<boolean>(false);
  const [detailObj, setDetailObj] = useState(null);

  // HANDLERS

  function handleIncubatorDetailDialogOpening(incubator) {
    setOpenIncubatorDetailDialog(true);
    setOpenIncubatorsDialog(false);
    setDetailObj(incubator);
  }

  const handleIncubatorDetailDialogClose = () => {
    setOpenIncubatorDetailDialog(false);
  };

  /**
   * Fetches incubator suggestion list
   */
  function fetchIncubatorSuggestion() {
    return http.request({
      url: state.next,
      method: Endpoints.GetIncubatorSuggestion.method
    });
  }

  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, if user is authenticated, fetches suggested incubators list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchIncubatorSuggestion()
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current && !ignore) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data,
                count: data.length
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
   * Handles subscriptions counter update on subscribe/unsubscribe action.
   * @param incubator
   */
  function handleSubscriptionsUpdate(incubator) {
    const newIncubators = [...state.results];
    const index = newIncubators.findIndex((i) => i.id === incubator.id);
    if (index !== -1) {
      if (incubator.subscribed) {
        newIncubators[index].subscribers_count = incubator.subscribers_count - 1;
        newIncubators[index].subscribed = !incubator.subscribed;
      } else {
        newIncubators[index].subscribers_count = incubator.subscribers_count + 1;
        newIncubators[index].subscribed = !incubator.subscribed;
      }
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: newIncubators}
      });
    }
  }

  /**
   * Renders suggested incubators list
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant={'h5'}>
        <FormattedMessage id="ui.IncubatorSuggestion.title" defaultMessage="ui.IncubatorSuggestion.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.IncubatorSuggestion.noResults" defaultMessage="ui.IncubatorSuggestion.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((incubator: SCIncubatorType) => (
              <ListItem key={incubator.id}>
                <Incubator
                  elevation={0}
                  incubator={incubator}
                  className={classes.incubatorItem}
                  subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                  ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(incubator)}}
                  {...IncubatorProps}
                />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} size="small" onClick={() => setOpenIncubatorsDialog(true)}>
              <FormattedMessage id="ui.IncubatorSuggestion.ShowAll" defaultMessage="ui.IncubatorSuggestion.ShowAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openIncubatorsDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.IncubatorSuggestion.title" defaultMessage="ui.IncubatorSuggestion.title" />}
          onClose={() => setOpenIncubatorsDialog(false)}
          open={openIncubatorsDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchIncubatorSuggestion}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.IncubatorSuggestion.noMoreIncubators" defaultMessage="ui.IncubatorSuggestion.noMoreIncubators" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((i) => (
                  <ListItem key={i.id} sx={{display: 'block', padding: 0}}>
                    <Incubator
                      elevation={0}
                      incubator={i}
                      className={classes.incubatorItem}
                      subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                      ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(i)}}
                      {...IncubatorProps}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
      {openIncubatorDetailDialog && (
        <IncubatorDetail
          open={openIncubatorDetailDialog}
          onClose={handleIncubatorDetailDialogClose}
          incubator={detailObj}
          onSubscriptionsUpdate={handleSubscriptionsUpdate}
        />
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
