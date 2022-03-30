import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography} from '@mui/material';
import {
  Endpoints,
  http,
  Logger,
  SCCustomAdvPosition,
  SCFeedDiscussionType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';
import TrendingPostSkeleton from '../TrendingFeed/Skeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject, {FeedObjectProps} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import CustomAdv from '../CustomAdv';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Widget from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCTrendingPost';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-noResults`,
  relatedItem: `${PREFIX}-related-item`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(2),
  [`& .${classes.relatedItem}`]: {
    marginBottom: 0
  }
}));

export interface RelatedDiscussionProps {
  /**
   * Id of the feed object
   * @default null
   */
  feedObjectId?: number;
  /**
   * Type of  feed object
   * @default 'discussion'
   */
  feedObjectType?: SCFeedObjectTypologyType;
  /**
   * Feed Object template type
   * @default 'snippet'
   */
  template?: SCFeedObjectTemplateType;
  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;
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

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];
/**
 *> API documentation for the Community-UI Related Discussion component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedDiscussion} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCRelatedDiscussion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedDiscussion-root|Styles applied to the root element.|
 |title|.SCRelatedDiscussion-title|Styles applied to the title element.|
 |noResults|.SCRelatedDiscussion-noResults|Styles applied to noResults section.|
 |relatedItem|.SCRelatedDiscussion-related-item|Styles applied to the related item element.|
 |showMore|.SCRelatedDiscussion-show-more|Styles applied to show more button element.|

 *
 * @param inProps
 */
export default function RelatedDiscussion(inProps: RelatedDiscussionProps): JSX.Element {
  // CONST
  const limit = 4;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();

  // PROPS
  const props: RelatedDiscussionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObjectId,
    feedObjectType,
    template = SCFeedObjectTemplateType.SNIPPET,
    FeedObjectProps = {},
    className,
    autoHide = true,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject: null, feedObjectType});
  const [objs, setObjs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visibleDiscussions, setVisibleDiscussions] = useState<number>(limit);
  const [openRelatedDiscussionDialog, setOpenRelatedDiscussionDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.RelatedDiscussion.url({type: feedObjectType, id: feedObjectId})}?limit=10`);
  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Render advertising
   */
  function renderAdvertising() {
    if (
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
    ) {
      return (
        <CustomAdv
          position={SCCustomAdvPosition.POSITION_RELATED_POSTS_COLUMN}
          {...(obj.categories.length && {categoriesId: obj.categories.map((c) => c.id)})}
        />
      );
    }
    return null;
  }

  /**
   * Fetches related discussions list
   */
  function fetchRelated() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.RelatedDiscussion.method
        })
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setObjs([...objs, ...data.results]);
          setHasMore(data.count > visibleDiscussions);
          setLoading(false);
          setTotal(data.count);
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
    fetchRelated();
  }, []);

  /**
   * Renders related discussions list
   */
  const advPosition = Math.floor(Math.random() * (Math.min(total, 5) - 1 + 1) + 1);
  const d = (
    <React.Fragment>
      {loading ? (
        <TrendingPostSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="body1">
            <FormattedMessage id="ui.relatedDiscussion.title" defaultMessage="ui.relatedDiscussion.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.relatedDiscussion.noResults" defaultMessage="ui.relatedDiscussion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {objs.slice(0, visibleDiscussions).map((obj: SCFeedDiscussionType, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div>
                        <FeedObject
                          elevation={0}
                          feedObject={obj}
                          key={obj.id}
                          template={template}
                          className={classes.relatedItem}
                          {...FeedObjectProps}
                        />
                      </div>
                      {advPosition === index && renderAdvertising()}
                    </React.Fragment>
                  );
                })}
              </List>
              {hasMore && (
                <Button size="small" className={classes.showMore} onClick={() => setOpenRelatedDiscussionDialog(true)}>
                  <FormattedMessage id="ui.relatedDiscussion.button.showMore" defaultMessage="ui.relatedDiscussion.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openRelatedDiscussionDialog && (
            <BaseDialog
              title={<FormattedMessage id="ui.relatedDiscussion.title" defaultMessage="ui.relatedDiscussion.title" />}
              onClose={() => setOpenRelatedDiscussionDialog(false)}
              open={openRelatedDiscussionDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={objs.length}
                  next={fetchRelated}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.relatedDiscussion.noMoreResults" defaultMessage="ui.relatedDiscussion.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {objs.map((obj: SCFeedDiscussionType, index) => (
                      <div key={index}>
                        <FeedObject
                          elevation={0}
                          feedObject={obj}
                          key={obj.id}
                          template={template}
                          className={classes.relatedItem}
                          {...FeedObjectProps}
                        />
                      </div>
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
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {d}
    </Root>
  );
}
