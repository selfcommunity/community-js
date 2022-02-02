import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedObjectTemplateType} from '../../types/feedObject';
import {Grid, Hidden} from '@mui/material';
import FeedObjectSkeleton from '../FeedObject/Skeleton';
import {GenericSkeleton} from '../Skeleton';
import InlineComposerSkeleton from '../InlineComposer/Skeleton';

const PREFIX = 'SCFeedSkeleton';

const classes = {
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`,
  end: `${PREFIX}-end`,
  refresh: `${PREFIX}-refresh`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  [`& .${classes.left}`]: {
    padding: '3px'
  },
  [`& .${classes.end}, & .${classes.refresh}`]: {
    textAlign: 'center'
  }
}));

export default function FeedSkeleton(props: {[p: string]: any}): JSX.Element {
  return (
    <Root container spacing={2}>
      <Grid item xs={12} md={7}>
        <InlineComposerSkeleton />
        {Array.from({length: 5}).map((e, i) => (
          <FeedObjectSkeleton key={i} template={FeedObjectTemplateType.PREVIEW} />
        ))}
      </Grid>
      <Hidden smDown>
        <Grid item xs={12} md={5}>
          <GenericSkeleton />
        </Grid>
      </Hidden>
    </Root>
  );
}
