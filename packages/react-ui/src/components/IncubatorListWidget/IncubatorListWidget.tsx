import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, Box, IconButton, ListItem, useTheme, useMediaQuery} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {http, Endpoints, SCPaginatedResponse, IncubatorService} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCIncubatorType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Incubator, {IncubatorProps, IncubatorSkeleton} from '../Incubator';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import CreateIncubatorDialog from './CreateIncubatorDialog';
import IncubatorDetail from '../IncubatorDetail';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/react-core';
import {AxiosResponse} from 'axios';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  actions: `${PREFIX}-actions`,
  helpPopover: `${PREFIX}-help-popover`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`,
  createDialog: `${PREFIX}-create-dialog`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(({theme}) => ({}));
export interface IncubatorListWidgetProps extends VirtualScrollerItemProps {
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
 * > API documentation for the Community-JS Incubator List Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a list of incubators.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/IncubatorsList)

 #### Import
 ```jsx
 import {IncubatorListWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `IncubatorListWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorListWidget-root|Styles applied to the root element.|
 |header|.SCIncubatorListWidget-header|Styles applied to the header element.|
 |title|.SCIncubatorListWidget-title|Styles applied to the title element.|
 |noResults|.SCIncubatorListWidget-no-results|Styles applied to the no results section.|
 |showMore|.SCIncubatorListWidget-show-more|Styles applied to the show more button element.|
 |actions|.SCIncubatorListWidget-actions|Styles applied to the actions section.|
 |helpPopover|.SCIncubatorListWidget-help-popover|Styles applied to the help popover element.|
 |dialogRoot|.SCIncubatorListWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCIncubatorListWidget-end-message|Styles applied to the end message element.|
 |createDialog|.SCIncubatorListWidget-create-dialog|Styles applied to the create dialog element.|

 * @param inProps
 */
export default function IncubatorListWidget(inProps: IncubatorListWidgetProps): JSX.Element {
  // PROPS
  const props: IncubatorListWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = true,
    limit = 3,
    className,
    IncubatorProps = {},
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.INCUBATOR_LIST_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openCreateIncubatorDialog, setOpenCreateIncubatorDialog] = useState<boolean>(false);
  const [openIncubatorDetailDialog, setOpenIncubatorDetailDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);
  const [detailObj, setDetailObj] = useState(null);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        IncubatorService.getAllIncubators({limit})
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

  //EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.initialized && state.results.length === limit) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      IncubatorService.getAllIncubators({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCIncubatorType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.initialized, state.results.length, limit]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [contentAvailability, scUserContext.user]);

  // HANDLERS
  const handleClickHelpButton = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = useMemo(
    () => (): void => {
      setAnchorEl(null);
    },
    [setAnchorEl]
  );

  const handleCreateIncubatorDialogClose = useMemo(
    () => (): void => {
      setOpenCreateIncubatorDialog(false);
    },
    [setOpenCreateIncubatorDialog]
  );

  const handleIncubatorDetailDialogOpening = useMemo(
    () =>
      (incubator): void => {
        setOpenIncubatorDetailDialog(true);
        setOpenDialog(false);
        setDetailObj(incubator);
      },
    [setOpenIncubatorDetailDialog, setOpenDialog, setDetailObj]
  );

  const handleIncubatorDetailDialogClose = useMemo(
    () => (): void => {
      setOpenIncubatorDetailDialog(false);
    },
    [setOpenIncubatorDetailDialog]
  );

  const handleToggleDialogOpen = useMemo(
    () => (): void => {
      setOpenDialog((prev) => !prev);
    },
    [setOpenDialog]
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
      console.log(newIncubators);
      dispatch({type: actionWidgetTypes.SET_RESULTS, payload: {results: newIncubators}});
    }
  };

  /**
   * Handle pagination
   */
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.GetAllIncubators.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCIncubatorType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  // RENDER
  if ((!contentAvailability && !scUserContext.user) || (state.initialized && autoHide && !state.count)) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Box className={classes.header}>
        <Typography className={classes.title} variant={'h5'}>
          <FormattedMessage id="ui.incubatorListWidget.title" defaultMessage="ui.incubatorListWidget.title" />
        </Typography>
        <IconButton className={classes.helpPopover} color="primary" aria-label="info" component="span" onClick={handleClickHelpButton}>
          <Icon fontSize="small">help_outline</Icon>
        </IconButton>
        {isOpen && (
          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}>
            <Box sx={{p: '10px'}}>
              <Typography component={'span'} sx={{whiteSpace: 'pre-line'}}>
                <FormattedMessage id="ui.incubatorListWidget.popover" defaultMessage="ui.incubatorListWidget.popover" />
              </Typography>
            </Box>
          </Popover>
        )}
      </Box>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.incubatorListWidget.noResults" defaultMessage="ui.incubatorListWidget.noResults" />
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
                  ButtonProps={{onClick: (): void => handleIncubatorDetailDialogOpening(incubator)}}
                  {...IncubatorProps}
                />
              </ListItem>
            ))}
          </List>
          <Box className={classes.actions}>
            {state.count > state.visibleItems && (
              <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
                <FormattedMessage id="ui.incubatorListWidget.ShowAll" defaultMessage="ui.incubatorListWidget.ShowAll" />
              </Button>
            )}
            <Button size="small" onClick={(): void => setOpenCreateIncubatorDialog(true)}>
              <FormattedMessage id="ui.incubatorListWidget.SuggestNewTopic" defaultMessage="ui.incubatorListWidget.SuggestNewTopic" />
            </Button>
          </Box>
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage id="ui.incubatorListWidget.title" defaultMessage="ui.incubatorListWidget.title" />}
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
                <FormattedMessage id="ui.incubatorListWidget.noMoreIncubators" defaultMessage="ui.incubatorListWidget.noMoreIncubators" />
              </Typography>
            }>
            <List>
              {state.results.map((incubator: SCIncubatorType) => (
                <ListItem key={incubator.id}>
                  <Incubator
                    elevation={0}
                    incubator={incubator}
                    subscribeButtonProps={{onSubscribe: handleSubscriptionsUpdate}}
                    ButtonProps={{onClick: (): void => handleIncubatorDetailDialogOpening(incubator)}}
                    {...IncubatorProps}
                  />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
      {openCreateIncubatorDialog && (
        <CreateIncubatorDialog className={classes.createDialog} open={openCreateIncubatorDialog} onClose={handleCreateIncubatorDialogClose} />
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
