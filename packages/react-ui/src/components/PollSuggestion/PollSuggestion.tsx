import React, {useEffect, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography, ListItem, useMediaQuery, useTheme} from '@mui/material';
import {SCFeedDiscussionType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCUserContextType, useIsComponentMountedRef, useSCUser} from '@selfcommunity/react-core';
import TrendingFeedSkeleton from '../TrendingFeed/Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import PollSnippet from './PollSnippet';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Skeleton from '../TrendingFeed/Skeleton';

const PREFIX = 'SCPollSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  pollSnippetItem: `${PREFIX}-poll-snippet-item`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(2),
  [`& .${classes.pollSnippetItem}`]: {
    marginBottom: 0
  }
}));

export interface PollSuggestionProps extends VirtualScrollerItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
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
 *> API documentation for the Community-JS Poll Suggestion component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PollSuggestion} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPollSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSuggestion-root|Styles applied to the root element.|
 |title|.SCPollSuggestion-title|Styles applied to the title element.|
 |no-results|.SCPollSuggestion-no-results|Styles applied to no results section.|
 |pollSnippetItem|.SCPollSuggestion-poll-snippet-item|Styles applied to the related item element.|
 |showMore|.SCPollSuggestion-show-more|Styles applied to show more button element.|

 *
 * @param inProps
 */
export default function PollSuggestion(inProps: PollSuggestionProps): JSX.Element {
  // CONST
  const limit = 4;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // PROPS
  const props: PollSuggestionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, autoHide = true, onHeightChange, onStateChange, cacheStrategy = CacheStrategies.NETWORK_ONLY, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: Endpoints.PollSuggestion.url({}),
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.POLL_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openPollSuggestionDialog, setOpenPollSuggestionDialog] = useState<boolean>(false);

  /**
   * Fetches related discussions list
   */
  function fetchPollSuggestion() {
    return http.request({
      url: state.next,
      method: Endpoints.PollSuggestion.method
    });
  }
  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, fetches related discussions list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next && scUserContext.user) {
      fetchPollSuggestion()
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
          Logger.error(SCOPE_SC_UI, error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [state.next, authUserId]);

  /**
   * Renders suggested poll list
   */
  if (state.isLoadingNext) {
    return <Skeleton elevation={0} />;
  }
  const p = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.pollSuggestion.title" defaultMessage="ui.pollSuggestion.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.pollSuggestion.noResults" defaultMessage="ui.pollSuggestion.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((obj: SCFeedDiscussionType) => {
              return (
                <ListItem key={obj.id}>
                  <PollSnippet elevation={0} feedObj={obj} className={classes.pollSnippetItem} />
                </ListItem>
              );
            })}
          </List>
          {limit < state.count && (
            <Button size="small" className={classes.showMore} onClick={() => setOpenPollSuggestionDialog(true)}>
              <FormattedMessage id="ui.pollSuggestion.button.showMore" defaultMessage="ui.pollSuggestion.button.showMore" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openPollSuggestionDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.pollSuggestion.title" defaultMessage="ui.pollSuggestion.title" />}
          onClose={() => setOpenPollSuggestionDialog(false)}
          open={openPollSuggestionDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchPollSuggestion}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.pollSuggestion.noMoreResults" defaultMessage="ui.pollSuggestion.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((obj: SCFeedDiscussionType) => (
                  <ListItem key={obj.id}>
                    <PollSnippet elevation={0} feedObj={obj} className={classes.pollSnippetItem} />
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
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {p}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
