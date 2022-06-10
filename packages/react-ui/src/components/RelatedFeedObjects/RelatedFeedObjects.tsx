import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import TrendingFeedSkeleton from '../TrendingFeed/Skeleton';
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
import {useThemeProps} from '@mui/system';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCCustomAdvPosition, SCFeedDiscussionType, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';

const PREFIX = 'SCRelatedFeedObjects';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
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

export interface RelatedFeedObjectsProps {
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
   * Feed Object
   * @default null
   */
  feedObject?: SCFeedObjectType;
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
 *> API documentation for the Community-JS Related FeedObjects component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjects} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjects` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedFeedObjects-root|Styles applied to the root element.|
 |title|.SCRelatedFeedObjects-title|Styles applied to the title element.|
 |no-results|.SCRelatedFeedObjects-no-results|Styles applied to no results section.|
 |relatedItem|.SCRelatedFeedObjects-related-item|Styles applied to the related item element.|
 |showMore|.SCRelatedFeedObjects-show-more|Styles applied to show more button element.|

 *
 * @param inProps
 */
export default function RelatedFeedObjects(inProps: RelatedFeedObjectsProps): JSX.Element {
  // CONST
  const limit = 4;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();

  // PROPS
  const props: RelatedFeedObjectsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObject,
    feedObjectId,
    feedObjectType,
    template = SCFeedObjectTemplateType.SNIPPET,
    FeedObjectProps = {},
    className,
    autoHide = true,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [objs, setObjs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visibleDiscussions, setVisibleDiscussions] = useState<number>(limit);
  const [openRelatedFeedObjectsDialog, setOpenRelatedFeedObjectsDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(
    `${Endpoints.RelatedFeedObjects.url({
      type: feedObject ? feedObject.type : feedObjectType,
      id: feedObject ? feedObject.id : feedObjectId
    })}?limit=10`
  );
  const objId = obj ? obj.id : null;

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
          method: Endpoints.RelatedFeedObjects.method
        })
        .then((res: HttpResponse<any>) => {
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
    if (objId !== null) {
      fetchRelated();
    }
  }, [objId]);

  /**
   * Renders related discussions list
   */
  const advPosition = Math.floor(Math.random() * (Math.min(total, 5) - 1 + 1) + 1);
  const d = (
    <React.Fragment>
      {loading ? (
        <TrendingFeedSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="h5">
            <FormattedMessage id="ui.relatedFeedObjects.title" defaultMessage="ui.relatedFeedObjects.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.relatedFeedObjects.noResults" defaultMessage="ui.relatedFeedObjects.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {objs.slice(0, visibleDiscussions).map((obj: SCFeedDiscussionType, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem>
                        <FeedObject elevation={0} feedObject={obj} template={template} className={classes.relatedItem} {...FeedObjectProps} />
                      </ListItem>
                      {advPosition === index && <ListItem>{renderAdvertising()}</ListItem>}
                    </React.Fragment>
                  );
                })}
              </List>
              {hasMore && (
                <Button size="small" className={classes.showMore} onClick={() => setOpenRelatedFeedObjectsDialog(true)}>
                  <FormattedMessage id="ui.relatedFeedObjects.button.showMore" defaultMessage="ui.relatedFeedObjects.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openRelatedFeedObjectsDialog && (
            <BaseDialog
              title={<FormattedMessage id="ui.relatedFeedObjects.title" defaultMessage="ui.relatedFeedObjects.title" />}
              onClose={() => setOpenRelatedFeedObjectsDialog(false)}
              open={openRelatedFeedObjectsDialog}>
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
                        <FormattedMessage id="ui.relatedFeedObjects.noMoreResults" defaultMessage="ui.relatedFeedObjects.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {objs.map((obj: SCFeedDiscussionType, index) => (
                      <ListItem key={index}>
                        <FeedObject elevation={0} feedObject={obj} template={template} className={classes.relatedItem} {...FeedObjectProps} />
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
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {d}
    </Root>
  );
}
