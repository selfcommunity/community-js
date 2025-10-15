import {CommentsFeedObjectSkeleton, FeedObjectSkeleton, SCFeedObjectTemplateType, RelatedFeedObjectsWidgetSkeleton} from '@selfcommunity/react-ui';
import {Box, Grid2, styled} from '@mui/material';
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
      <Grid2 container width="100%" spacing={2}>
        <Grid2 size={{md: 7}}>
          <FeedObjectSkeleton template={SCFeedObjectTemplateType.DETAIL} {...FeedObjectSkeletonProps} />
          <CommentsFeedObjectSkeleton count={4} {...CommentsFeedObjectSkeletonProps} />
        </Grid2>
        <Grid2 size={{md: 5}}>
          <RelatedFeedObjectsWidgetSkeleton {...RelatedFeedObjectsSkeletonProps} />
        </Grid2>
      </Grid2>
    </Root>
  );
}
