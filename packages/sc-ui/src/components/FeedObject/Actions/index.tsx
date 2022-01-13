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
export interface ActionsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Feed object id
   * @default null
   */
  feedObjectId?: number;
  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;
  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: SCFeedObjectTypologyType;
  /**
   * Hides share action
   * @default false
   */
  hideShareAction?: boolean;
  /**
   * Handles section expansion
   * @default null
   */
  handleExpandActivities?: () => void;
}
export default function Actions(props: ActionsProps): JSX.Element {
  // PROPS
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    hideShareAction = false,
    handleExpandActivities = null
  } = props;
  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  if (!obj) {
    return null;
  }

  /**
   * Renders action section
   */
  return (
    <Root container className={className}>
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
