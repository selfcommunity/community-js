import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, ListItem, useMediaQuery, useTheme} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {http, Endpoints, SuggestionService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCThemeType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCIncubatorType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Incubator, {IncubatorProps, IncubatorSkeleton} from '../Incubator';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import IncubatorDetail from '../IncubatorDetail';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCIncubatorSuggestionWidget';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));
export interface IncubatorSuggestionWidgetProps extends VirtualScrollerItemProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of incubators to show
   * @default false
   */
  limit?: number;
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
   * Props to spread to users suggestion dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;
  /**
   * Other props
   */
  [p: string]: any;
}
/**
 > API documentation for the Community-JS Incubator Suggestion component. Learn about the available props and the CSS API.
 * <br/>This component renders a list of suggested incubators.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/IncubatorSuggestion)

 #### Import
 ```jsx
 import {IncubatorSuggestionWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCIncubatorSuggestionWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSuggestionWidget-root|Styles applied to the root element.|
 |title|.SCIncubatorSuggestionWidget-title|Styles applied to the title element.|
 |noResults|.SCIncubatorSuggestionWidget-no-results|Styles applied to the no results section.|
 |showMore|.SCIncubatorSuggestionWidget-show-more|Styles applied to the show more button element.|
 |dialogRoot|.SCIncubatorSuggestionWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCIncubatorSuggestionWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function IncubatorSuggestionWidget(inProps: IncubatorSuggestionWidgetProps): JSX.Element {
  // PROPS
  const props: IncubatorSuggestionWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = true,
    limit = 3,
    className,
    IncubatorProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.INCUBATOR_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openIncubatorDetailDialog, setOpenIncubatorDetailDialog] = useState<boolean>(false);
  const [detailObj, setDetailObj] = useState(null);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Initialize component
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        SuggestionService.getIncubatorSuggestion({limit})
          .then((payload: SCPaginatedResponse<SCIncubatorType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      SuggestionService.getIncubatorSuggestion({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCIncubatorType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results.length, state.initialized, limit]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user, cacheStrategy]);

  // HANDLERS
  const handleIncubatorDetailDialogOpening = useMemo(
    () =>
      (incubator): void => {
        setOpenIncubatorDetailDialog(true);
        setOpenDialog(false);
        setDetailObj(incubator);
      },
    [setOpenIncubatorDetailDialog, setOpenDialog, setDetailObj]
  );

  const handleIncubatorDetailDialogClose = () => {
    setOpenIncubatorDetailDialog(false);
  };

  const handleToggleDialogOpen = useMemo(
    () => (): void => {
      setOpenDialog((prev) => !prev);
    },
    []
  );

  /**
   * Handles subscriptions counter update on subscribe/unsubscribe action.
   * @param incubator
   */
  const handleSubscriptionsUpdate = (incubator): void => {
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
      dispatch({type: actionWidgetTypes.SET_RESULTS, payload: {results: newIncubators}});
    }
  };

  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.GetIncubatorSuggestion.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCIncubatorType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  // RENDER
  if ((autoHide && !state.count && state.initialized) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Typography className={classes.title} variant={'h5'}>
        <FormattedMessage id="ui.incubatorSuggestionWidget.title" defaultMessage="ui.incubatorSuggestionWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.incubatorSuggestionWidget.noResults" defaultMessage="ui.incubatorSuggestionWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((incubator: SCIncubatorType) => (
              <ListItem key={incubator.id}>
                <Incubator
                  elevation={0}
                  incubator={incubator}
                  subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                  ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(incubator)}}
                  {...IncubatorProps}
                />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.incubatorSuggestionWidget.ShowAll" defaultMessage="ui.incubatorSuggestionWidget.ShowAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage id="ui.incubatorSuggestionWidget.title" defaultMessage="ui.incubatorSuggestionWidget.title" />}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<IncubatorSkeleton elevation={0} {...IncubatorProps} />}
            height={isMobile ? '100vh' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.incubatorSuggestionWidget.noMoreIncubators" defaultMessage="ui.incubatorSuggestionWidget.noMoreIncubators" />
              </Typography>
            }>
            <List>
              {state.results.map((incubator: SCIncubatorType) => (
                <ListItem key={incubator.id}>
                  <Incubator
                    elevation={0}
                    incubator={incubator}
                    subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                    ButtonProps={{onClick: () => handleIncubatorDetailDialogOpening(incubator)}}
                    {...IncubatorProps}
                  />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
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
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
