import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote from './Vote';
import Comment from './Comment';
import Share from './Share';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';

const PREFIX = 'SCFeedObjectActions';

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  margin: '0px 0px',
  color: '#3A3A3A'
}));

export default function Actions({
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  hideShareAction = false,
  handleExpandActivities = null
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  hideShareAction?: boolean;
  handleExpandActivities?: () => void;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  if (!obj) {
    return null;
  }
  return (
    <Root container>
      <Grid item xs={hideShareAction ? 6 : 4} sx={{textAlign: 'center'}}>
        <Vote feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
      </Grid>
      <Grid item xs={hideShareAction ? 6 : 4} sx={{textAlign: 'center'}}>
        <Comment feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} onActionCLick={handleExpandActivities} />
      </Grid>
      {!hideShareAction && (
        <Grid item xs={4} sx={{textAlign: 'center'}}>
          <Share feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
        </Grid>
      )}
    </Root>
  );
}
