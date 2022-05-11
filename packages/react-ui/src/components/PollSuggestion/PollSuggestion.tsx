import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography, ListItem} from '@mui/material';
import {SCFeedDiscussionType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import TrendingFeedSkeleton from '../TrendingFeed/Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Widget from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';
import PollSnippet from './PollSnippet';

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

export interface PollSuggestionProps {
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
   * Other props
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-UI Poll Suggestion component. Learn about the available props and the CSS API.

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
  const {className, autoHide = true, ...rest} = props;

  // STATE
  const [objs, setObjs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visibleObjs, setVisibleObjs] = useState<number>(limit);
  const [openPollSuggestionDialog, setOpenPollSuggestionDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.PollSuggestion.url()}?limit=10`);

  /**
   * Fetches related discussions list
   */
  function fetchPollSuggestion() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.PollSuggestion.method
        })
        .then((res: HttpResponse<any>) => {
          const data = res.data;
          setObjs([...objs, ...data]);
          setTotal(data.length);
          setHasMore(data.length > visibleObjs);
          setLoading(false);
          setNext(data['next']);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * On mount, fetches related discussions list
   */
  useEffect(() => {
    if (scUserContext.user) {
      fetchPollSuggestion();
    }
  }, [authUserId]);

  /**
   * Renders suggested poll list
   */

  const p = (
    <React.Fragment>
      {loading ? (
        <TrendingFeedSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="h5">
            <FormattedMessage id="ui.pollSuggestion.title" defaultMessage="ui.pollSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.pollSuggestion.noResults" defaultMessage="ui.pollSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {objs.slice(0, visibleObjs).map((obj: SCFeedDiscussionType) => {
                  return (
                    <ListItem key={obj.id}>
                      <PollSnippet elevation={0} feedObj={obj} className={classes.pollSnippetItem} />
                    </ListItem>
                  );
                })}
              </List>
              {hasMore && (
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
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={objs.length}
                  next={fetchPollSuggestion}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.pollSuggestion.noMoreResults" defaultMessage="ui.pollSuggestion.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {objs.map((obj: SCFeedDiscussionType) => (
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
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {p}
      </Root>
    );
  }
  return null;
}
