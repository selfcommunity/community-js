import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden} from '@mui/material';
import Sticky from 'react-stickynode';
import FeedObjectDetailSkeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {scrollIntoView} from 'seamless-scroll-polyfill';
import {FormattedMessage} from 'react-intl';
import {SCCommentType, SCCustomAdvPosition, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {
  CommentsFeedObjectProps,
  CustomAdv,
  FeedObject,
  FeedObjectProps,
  RelatedFeedObjects,
  SCFeedObjectTemplateType,
  CommentsFeedObject,
  RelatedFeedObjectsProps
} from '@selfcommunity/react-ui';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';

const PREFIX = 'SCFeedObjectDetailTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface FeedObjectDetailProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of feed object
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Type of feed object
   * @default SCFeedObjectTypologyType.POST
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to CommentsFeedObject
   * @default empty object
   */
  CommentsFeedObjectProps?: CommentsFeedObjectProps;

  /**
   * Props to spread to RelatedFeedObject
   * @default empty object
   */
  RelatedFeedObjectProps?: RelatedFeedObjectsProps;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

/**
 * > API documentation for the Community-JS Feed Object Detail Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObjectDetail} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCFeedObjectDetailTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObjectDetailTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */

export default function FeedObjectDetail(inProps: FeedObjectDetailProps): JSX.Element {
  // PROPS
  const props: FeedObjectDetailProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'feed_object_page',
    className,
    feedObjectId,
    feedObject,
    feedObjectType,
    FeedObjectProps = {},
    CommentsFeedObjectProps = {},
    RelatedFeedObjectProps = {autoHide: false}
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // RETRIVE OBJECTS
  const {obj, setObj, error} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [comments, setComments] = useState<SCCommentType[]>([]);

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Render advertising above FeedObject Detail
   */
  function renderAdvertising() {
    if (
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
    ) {
      return (
        <CustomAdv
          position={SCCustomAdvPosition.POSITION_BELOW_FEED_OBJECT}
          {...(obj.categories.length && {categoriesId: obj.categories.map((c) => c.id)})}
        />
      );
    }
    return null;
  }

  /**
   * Handle add comment
   * @param comment
   */
  function handleReply(comment: SCCommentType) {
    setComments([...comments, ...[comment]]);
    setTimeout(() => {
      const element = document.getElementById(`comment_object_${comment.id}`);
      if (element) {
        scrollIntoView(element, {behavior: 'smooth', block: 'center', inline: 'center'});
      }
    }, 300);
  }

  if (error) {
    return (
      <Box>
        <FormattedMessage id="templates.feedObjectDetail.contributionNotFound" defaultMessage="templates.feedObjectDetail.contributionNotFound" />
      </Box>
    );
  }
  if (!obj) {
    return <FeedObjectDetailSkeleton />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FeedObject {...FeedObjectProps} feedObject={obj} template={SCFeedObjectTemplateType.DETAIL} onReply={handleReply} />
          {renderAdvertising()}
          <CommentsFeedObject showTitle feedObject={obj} comments={comments} {...CommentsFeedObjectProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Hidden mdDown>
            <Sticky enabled top={15} bottomBoundary={`#${id}`}>
              <RelatedFeedObjects feedObject={obj} {...RelatedFeedObjectProps} />
            </Sticky>
          </Hidden>
        </Grid>
      </Grid>
    </Root>
  );
}
