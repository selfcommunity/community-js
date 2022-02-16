import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';
import TrendingPostSkeleton from '../TrendingFeed/Skeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject, {FeedObjectProps} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {FeedObjectTemplateType} from '../../types/feedObject';
import CustomAdv from '../CustomAdv';
import classNames from 'classnames';

const PREFIX = 'SCTrendingPost';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(2)
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
  template?: FeedObjectTemplateType;
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

export default function RelatedDiscussion(props: RelatedDiscussionProps): JSX.Element {
  // CONST
  const limit = 4;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();

  // PROPS
  const {feedObjectId, feedObjectType, template = FeedObjectTemplateType.SNIPPET, FeedObjectProps = {}, className, autoHide = true, ...rest} = props;

  // STATE
  const [objs, setObjs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visibleDiscussions, setVisibleDiscussions] = useState<number>(limit);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);

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
      return <CustomAdv position={SCCustomAdvPosition.POSITION_RELATED_POSTS_COLUMN} />;
    }
    return null;
  }

  /**
   * Fetches related discussions list
   */
  function fetchRelated() {
    http
      .request({
        url: Endpoints.RelatedDiscussion.url({type: feedObjectType, id: feedObjectId}),
        method: Endpoints.RelatedDiscussion.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setObjs(data.results);
        setHasMore(data.count > visibleDiscussions);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Loads more discussions on "see more" button click
   */
  function loadDiscussions() {
    const newIndex = visibleDiscussions + limit;
    const newHasMore = newIndex < objs.length - 1;
    setVisibleDiscussions(newIndex);
    setHasMore(newHasMore);
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
          <Typography variant="body1">
            <FormattedMessage id="ui.relatedDiscussion.title" defaultMessage="ui.relatedDiscussion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.relatedDiscussion.noResults" defaultMessage="ui.relatedDiscussion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {objs.slice(0, visibleDiscussions).map((obj: SCFeedDiscussionType, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div>
                        <FeedObject elevation={0} feedObject={obj} key={obj.id} template={template} />
                      </div>
                      {advPosition === index && renderAdvertising()}
                    </React.Fragment>
                  );
                })}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadDiscussions()}>
                  <FormattedMessage id="ui.relatedDiscussion.button.showMore" defaultMessage="ui.relatedDiscussion.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openTrendingPostDialog && <></>}
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
