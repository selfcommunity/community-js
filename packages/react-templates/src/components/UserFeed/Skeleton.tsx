import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedObjectSkeleton, SCFeedObjectTemplateType, FeedSkeleton, GenericSkeleton, InlineComposerWidgetSkeleton} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS User Feed Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFeedSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserFeedTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFeedTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserFeedSkeleton(): JSX.Element {
  return (
    <Root
      className={classes.root}
      sidebar={
        <React.Fragment>
          <GenericSkeleton sx={{mb: 2}} />
          <GenericSkeleton sx={{mb: 2}} />
        </React.Fragment>
      }>
      <InlineComposerWidgetSkeleton />
      {Array.from({length: 5}).map((e, i) => (
        <FeedObjectSkeleton key={i} template={SCFeedObjectTemplateType.DETAIL} />
      ))}
    </Root>
  );
}
