import React from 'react';
import {CommentsFeedObjectSkeleton, FeedObjectSkeleton, SCFeedObjectTemplateType, RelatedFeedObjectsWidgetSkeleton} from '@selfcommunity/react-ui';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Feed Object Detail Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObjectDetailSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCFeedObjectDetailTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObjectDetailTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function FeedObjectDetailSkeleton(props): JSX.Element {
  const {FeedObjectSkeletonProps = {}, CommentsFeedObjectSkeletonProps = {}, RelatedFeedObjectsSkeletonProps = {}} = props;
  return (
    <Root className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FeedObjectSkeleton template={SCFeedObjectTemplateType.DETAIL} {...FeedObjectSkeletonProps} />
          <CommentsFeedObjectSkeleton count={4} {...CommentsFeedObjectSkeletonProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          <RelatedFeedObjectsWidgetSkeleton {...RelatedFeedObjectsSkeletonProps} />
        </Grid>
      </Grid>
    </Root>
  );
}
