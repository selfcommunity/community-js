import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {SCFeedObjectType} from '@selfcommunity/types';
import {Endpoints, http, SCPaginatedResponse, SuggestionService} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCThemeType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import Skeleton from '../CategoryTrendingFeedWidget/Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import PollSnippet, {PollSnippetProps, PollSnippetSkeleton} from './PollSnippet';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCPollSuggestionWidget';

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

export interface PollSuggestionWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of categories to show
   * @default false
   */
  limit?: number;
  /**
   * Props to spread to single category object
   * @default empty object
   */
  PollSnippetProps?: PollSnippetProps;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to categories suggestion dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Poll Suggestion Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PollSuggestionWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPollSuggestionWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSuggestionWidget-root|Styles applied to the root element.|
 |title|.SCPollSuggestionWidget-title|Styles applied to the title element.|
 |noResults|.SCPollSuggestionWidget-no-results|Styles applied to no results section.|
 |showMore|.SCPollSuggestionWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCPollSuggestionWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCPollSuggestionWidget-end-message|Styles applied to the end message element.|

 *
 * @param inProps
 */
export default function PollSuggestionWidget(inProps: PollSuggestionWidgetProps): JSX.Element {
  // PROPS
  const props: PollSuggestionWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = true,
    limit = 3,
    PollSnippetProps = {},
    className,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.POLL_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // EFFECTS
  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);
  /**
   * On mount, fetches polls list
   */
  useEffect(() => {
    if (!scUserContext.user || state.initialized || state.isLoadingNext) {
      return;
    }
    dispatch({
      type: actionWidgetTypes.LOADING_NEXT
    });
    const controller = new AbortController();
    SuggestionService.getPollSuggestion({limit}, {signal: controller.signal})
      .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
        dispatch({
          type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
          payload: {...payload, initialized: true}
        });
      })
      .catch((error) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
    return () => controller.abort();
  }, [scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({
        type: actionWidgetTypes.LOADING_NEXT
      });
      SuggestionService.getPollSuggestion({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: payload
          });
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  // HANDLERS
  const handleNext = useMemo(
    () => () => {
      if (!state.initialized || state.isLoadingNext) {
        return;
      }
      dispatch({
        type: actionWidgetTypes.LOADING_NEXT
      });
      return http
        .request({
          url: state.next,
          method: Endpoints.PopularCategories.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCFeedObjectType>>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: res.data
          });
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((autoHide && !state.count && state.initialized) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.pollSuggestionWidget.title" defaultMessage="ui.pollSuggestionWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.pollSuggestionWidget.noResults" defaultMessage="ui.pollSuggestionWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((obj) => (
              <ListItem key={obj.id}>
                <PollSnippet elevation={0} feedObj={obj} {...PollSnippetProps} />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.pollSuggestionWidget.button.showAll" defaultMessage="ui.pollSuggestionWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.pollSuggestionWidget.title" id="ui.pollSuggestionWidget.title" />}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<PollSnippetSkeleton elevation={0} {...PollSnippetProps} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.pollSuggestionWidget.noMoreResults" defaultMessage="ui.pollSuggestionWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((obj) => (
                <ListItem key={obj.id}>
                  <PollSnippet elevation={0} feedObj={obj} {...PollSnippetProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </CardContent>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
