import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden, Typography} from '@mui/material';
import {
  FeedObject,
  FeedObjectProps,
  RelatedDiscussion,
  SCFeedObjectTemplateType,
  CommentsObject,
  SCCommentsOrderBy,
  CustomAdv,
  CommentsObjectProps
} from '@selfcommunity/ui';
import Sticky from 'react-stickynode';
import {
  SCCustomAdvPosition,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';
import FeedObjectDetailSkeleton from './Skeleton';

const PREFIX = 'SCFeedObjectDetailTemplate';

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
   * Props to spread to CommentsObject
   * @default empty object
   */
  CommentsObjectProps?: CommentsObjectProps;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

export default function FeedObjectDetail(props: FeedObjectDetailProps): JSX.Element {
  // PROPS
  const {id = 'feed_object_page', className, feedObjectId, feedObject, feedObjectType, FeedObjectProps = {}, CommentsObjectProps = {}} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

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

  if (obj === null) {
    return <FeedObjectDetailSkeleton />;
  }

  return (
    <Root id={id} className={className}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FeedObject {...FeedObjectProps} feedObject={obj} template={SCFeedObjectTemplateType.DETAIL} />
          {renderAdvertising()}
          <CommentsObject showTitle feedObject={obj} commentsOrderBy={SCCommentsOrderBy.ADDED_AT_ASC} fixedPrimaryReply {...CommentsObjectProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Hidden smDown>
            <Sticky enabled top={15}>
              <RelatedDiscussion feedObjectId={feedObjectId} feedObjectType={feedObjectType} />
            </Sticky>
          </Hidden>
        </Grid>
      </Grid>
    </Root>
  );
}
