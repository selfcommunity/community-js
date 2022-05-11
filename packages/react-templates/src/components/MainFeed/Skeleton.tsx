import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedObjectSkeleton, SCFeedObjectTemplateType, FeedSkeleton, GenericSkeleton, InlineComposerSkeleton} from '@selfcommunity/react-ui';

const PREFIX = 'SCMainFeedTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

/**
 * > API documentation for the Community-UI Main Feed Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MainFeedSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCMainFeedTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCMainFeedTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function MainFeedSkeleton(): JSX.Element {
  return (
    <Root
      className={classes.root}
      sidebar={
        <React.Fragment>
          <GenericSkeleton sx={{mb: 2}} />
          <GenericSkeleton sx={{mb: 2}} />
        </React.Fragment>
      }>
      <InlineComposerSkeleton />
      {Array.from({length: 5}).map((e, i) => (
        <FeedObjectSkeleton key={i} template={SCFeedObjectTemplateType.DETAIL} />
      ))}
    </Root>
  );
}
