import React from 'react';
import {CommentsFeedObjectSkeleton, FeedObjectSkeleton, SCFeedObjectTemplateType} from '@selfcommunity/ui';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCFeedObjectDetailTemplateSkeleton';

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

/**
 * > API documentation for the Community-UI Feed Object Detail Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObjectDetailSkeleton} from '@selfcommunity/templates';
 ```

 #### Component Name

 The name `SCFeedObjectDetailTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObjectDetailTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function FeedObjectDetailSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FeedObjectSkeleton template={SCFeedObjectTemplateType.DETAIL} />
        </Grid>
        <Grid item xs={12}>
          <CommentsFeedObjectSkeleton />
        </Grid>
      </Grid>
    </Root>
  );
}
