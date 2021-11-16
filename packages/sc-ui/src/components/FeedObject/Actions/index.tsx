import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote from './Vote';
import Share from './Share';
import Comment from './Comment';
import LazyLoad from 'react-lazyload';
import {SCFeedObjectType} from '@selfcommunity/core';

const PREFIX = 'SCFeedObjectActions';

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  margin: '13px 0',
  color: '#3A3A3A'
}));

export default function Actions({feedObject = null}: {feedObject: SCFeedObjectType}): JSX.Element {
  if (!feedObject) {
    return null;
  }
  return (
    <LazyLoad height={360}>
      <Root container>
        <Grid item xs={4}>
          <Vote object={feedObject} withAction={true} inlineAction={false} />
        </Grid>
        <Grid item xs={4}>
          <Comment object={feedObject} withAction={true} />
        </Grid>
        <Grid item xs={4}>
          <Share object={feedObject} withAction={true} inlineAction={false} />
        </Grid>
      </Root>
    </LazyLoad>
  );
}
