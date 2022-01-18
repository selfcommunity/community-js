import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Hidden, Typography} from '@mui/material';
import {FeedObject, RelatedDiscussion, FeedObjectTemplateType, CommentsObject, CommentsOrderBy, CustomAdv} from '@selfcommunity/ui';
import Sticky from 'react-stickynode';
import {
  SCCustomAdvPosition,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';

const PREFIX = 'SCFeedObjectPage';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface FeedObjectPageProps {
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
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

export default function FeedObjectPage(props: FeedObjectPageProps): JSX.Element {
  // PROPS
  const {id = 'feed_object_page', className, feedObjectId, feedObject, feedObjectType} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();

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
          position={SCCustomAdvPosition.POSITION_BELOW_FEED_OBJECT} /*{...(obj.categories.length ? {categoryId: obj.categories[0].id} : {})}*/
        />
      );
    }
    return null;
  }

  return (
    <Root id={id} className={className}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FeedObject
            variant={'outlined'}
            feedObject={feedObject}
            feedObjectId={feedObjectId}
            feedObjectType={feedObjectType}
            template={FeedObjectTemplateType.DETAIL}
          />
          {renderAdvertising()}
          <CommentsObject
            variant={'outlined'}
            showTitle
            feedObject={feedObject}
            feedObjectId={feedObjectId}
            feedObjectType={feedObjectType}
            commentsOrderBy={CommentsOrderBy.ADDED_AT_ASC}
            bottomPrimaryReply
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Hidden smDown>
            <Sticky enabled top={15}>
              <RelatedDiscussion variant={'outlined'} feedObjectId={feedObjectId} feedObjectType={feedObjectType} />
            </Sticky>
          </Hidden>
        </Grid>
      </Grid>
    </Root>
  );
}
