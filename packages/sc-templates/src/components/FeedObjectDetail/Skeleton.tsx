import React from 'react';
import {CommentObjectSkeleton, FeedObjectSkeleton, SCFeedObjectTemplateType, GenericSkeleton} from '@selfcommunity/ui';
import {Box, Grid, Hidden} from '@mui/material';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCFeedObjectDetailSkeleton';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export default function FeedObjectDetailSkeleton(): JSX.Element {
  return (
    <Root>
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
