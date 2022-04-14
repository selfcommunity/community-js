import React from 'react';
import {CommentObjectSkeleton, FeedObjectSkeleton, SCFeedObjectTemplateType, GenericSkeleton} from '@selfcommunity/ui';
import {Box, Grid, Hidden} from '@mui/material';
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
        <Grid item xs={12} md={7}>
          <FeedObjectSkeleton template={SCFeedObjectTemplateType.DETAIL} />
          <CommentObjectSkeleton />
        </Grid>
        <Grid item xs={12} md={5}>
          <Hidden smDown>
            <GenericSkeleton />
          </Hidden>
        </Grid>
      </Grid>
    </Root>
  );
}
