import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote from './Vote';
import Comment from './Comment';
import Share from './Share';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';
import {FeedObjectTemplateType} from '../../../types/feedObject';
import classNames from 'classnames';

const PREFIX = 'SCFeedObjectActions';

const classes = {
  root: `${PREFIX}-root`
};

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
   * Feed Object template type
   * @default 'preview'
   */
  feedObjectTemplate?: FeedObjectTemplateType;

  /**
   * Hides share action
   * @default false
   */
  hideShareAction?: boolean;

  /**
   * Hides comment action
   * @default false
   */
  hideCommentAction?: boolean;

  /**
   * Handles section expansion
   * @default null
   */
  handleExpandActivities?: () => void;
}
export default function Actions(props: ActionsProps): JSX.Element {
  // PROPS
  const {
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectTemplate = FeedObjectTemplateType.PREVIEW,
    hideShareAction = false,
    hideCommentAction = false,
    handleExpandActivities
  } = props;
  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  if (!obj) {
    return null;
  }

  /**
   * Calculate column width
   */
  function getColumnWidth() {
    let width = 4;
    if (hideShareAction && hideCommentAction) {
      width = 12;
    } else if (hideCommentAction || hideCommentAction) {
      width = 6;
    }
    return width;
  }

  /**
   * Renders action section
   */
  const columnWidth = getColumnWidth();
  return (
    <Root container className={classNames(classes.root, className)}>
      <Grid item xs={columnWidth} sx={{textAlign: 'center'}}>
        <Vote feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
      </Grid>
      {!hideCommentAction && (
        <Grid item xs={columnWidth} sx={{textAlign: 'center'}}>
          <Comment
            feedObject={obj}
            feedObjectType={feedObjectType}
            id={feedObjectId}
            feedObjectTemplate={feedObjectTemplate}
            withAction={true}
            onCommentAction={handleExpandActivities}
          />
        </Grid>
      )}
      {!hideShareAction && (
        <Grid item xs={columnWidth} sx={{textAlign: 'center'}}>
          <Share feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
        </Grid>
      )}
    </Root>
  );
}
