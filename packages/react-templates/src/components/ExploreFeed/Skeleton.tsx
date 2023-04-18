import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedObjectSkeleton, SCFeedObjectTemplateType, FeedSkeleton, GenericSkeleton, InlineComposerWidgetSkeleton} from '@selfcommunity/react-ui';

const PREFIX = 'SCExploreFeedTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

/**
 * > API documentation for the Community-JS Explore Feed Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ExploreFeedSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCExploreFeedTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCExploreFeedTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function ExploreFeedSkeleton(): JSX.Element {
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
