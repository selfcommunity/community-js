import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography, Box, IconButton, ListItem} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCIncubatorType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Incubator, {IncubatorProps} from '../Incubator';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import CreateIncubatorDialog from './CreateIncubatorDialog';
import IncubatorDetail from '../IncubatorDetail';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import {SCCache, useIsComponentMountedRef} from '@selfcommunity/react-core';

const PREFIX = 'SCIncubatorsList';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  incubatorItem: `${PREFIX}-incubator-item`,
  noResults: `${PREFIX}-no-results`,
  actions: `${PREFIX}-actions`,
  helpPopover: `${PREFIX}-help-popover`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.header}`]: {
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  '& .MuiListItem-root': {
    display: 'block',
    padding: 0
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  }
}));

export interface IncubatorsListProps extends VirtualScrollerItemProps {
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
 > API documentation for the Community-JS Incubators List component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {IncubatorsList} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCIncubatorsList` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorsList-root|Styles applied to the root element.|
 |header|.SCIncubatorsList-header|Styles applied to the header element.|
 |title|.SCIncubatorsList-title|Styles applied to the title element.|
 |incubatorItem|.SCIncubatorsList-incubator-item|Styles applied to the incubator item element.|
 |noResults|.SCIncubatorsList-no-results|Styles applied to the no results section.|
 |actions|.SCIncubatorsList-actions|Styles applied to the actions section.|
 |helpPopover|.SCIncubatorsList-help-popover|Styles applied to the help popover element.|

 * @param inProps
 */
export default function IncubatorsList(inProps: IncubatorsListProps): JSX.Element {
  // CONST
  const limit = 2;

  // PROPS
  const props: IncubatorsListProps = useThemeProps({
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
  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.GetAllIncubators.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.INCUBATORS_LIST_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openIncubatorsDialog, setOpenIncubatorsDialog] = useState<boolean>(false);
  const [openCreateIncubatorDialog, setOpenCreateIncubatorDialog] = useState<boolean>(false);
  const [openIncubatorDetailDialog, setOpenIncubatorDetailDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);
  const [detailObj, setDetailObj] = useState(null);

  // HANDLERS

  const handleClickHelpButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCreateIncubatorDialogClose = () => {
    setOpenCreateIncubatorDialog(false);
  };

  function handleIncubatorDetailDialogOpening(incubator) {
    setOpenIncubatorDetailDialog(true);
    setOpenIncubatorsDialog(false);
    setDetailObj(incubator);
  }

  const handleIncubatorDetailDialogClose = () => {
    setOpenIncubatorDetailDialog(false);
  };

  /**
   * Fetches incubators list
   */
  const fetchIncubators = useMemo(
    () => () => {
      if (state.next) {
        dispatch({type: actionToolsTypes.LOADING_NEXT});
        http
          .request({
            url: state.next,
            method: Endpoints.GetAllIncubators.method
          })
          .then((res: HttpResponse<any>) => {
            if (res.status < 300 && isMountedRef.current) {
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
      }
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  /**
   * On mount, fetches  incubators list
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      fetchIncubators();
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, []);

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
   * Renders incubators list
   */
  if (state.isLoadingNext) {
    return <Skeleton elevation={0} />;
  }
  const c = (
    <CardContent>
      <Box className={classes.header}>
        <Typography className={classes.title} variant={'h5'}>
          <FormattedMessage id="ui.incubatorsList.title" defaultMessage="ui.incubatorsList.title" />
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
                <FormattedMessage id="ui.incubatorsList.popover" defaultMessage="ui.incubatorsList.popover" />
              </Typography>
            </Box>
          </Popover>
        )}
      </Box>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.incubatorsList.noResults" defaultMessage="ui.incubatorsList.noResults" />
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
          <Box className={classes.actions}>
            {limit < state.count && (
              <Button size="small" onClick={() => setOpenIncubatorsDialog(true)}>
                <FormattedMessage id="ui.incubatorsList.ShowAll" defaultMessage="ui.incubatorsList.ShowAll" />
              </Button>
            )}
            <Button size="small" onClick={() => setOpenCreateIncubatorDialog(true)}>
              <FormattedMessage id="ui.incubatorsList.SuggestNewTopic" defaultMessage="ui.incubatorsList.SuggestNewTopic" />
            </Button>
          </Box>
        </React.Fragment>
      )}
      {openIncubatorsDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.incubatorsList.title" defaultMessage="ui.incubatorsList.title" />}
          onClose={() => setOpenIncubatorsDialog(false)}
          open={openIncubatorsDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchIncubators}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.incubatorsList.noMoreIncubators" defaultMessage="ui.incubatorsList.noMoreIncubators" />
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
      {openCreateIncubatorDialog && <CreateIncubatorDialog open={openCreateIncubatorDialog} onClose={handleCreateIncubatorDialogClose} />}
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
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
