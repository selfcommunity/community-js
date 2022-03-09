import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote, {VoteProps} from './Vote';
import Comment, {CommentProps} from './Comment';
import Share, {ShareProps} from './Share';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';
import {FeedObjectTemplateType} from '../../../types/feedObject';
import classNames from 'classnames';

const PREFIX = 'SCFeedObjectActions';

const classes = {
  root: `${PREFIX}-root`,
  action: `${PREFIX}-action`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  margin: '0px 0px',
  color: '#3A3A3A',
  [`& .${classes.action}`]: {
    textAlign: 'center'
  }
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
   * Hides vote action
   * @default false
   */
  hideVoteAction?: boolean;

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

  /**
   * Props to spread to Comment action component
   * @default {inlineAction: false}
   */
  VoteActionProps?: VoteProps;

  /**
   * Props to spread to Vote action component
   * @default {inlineAction: false}
   */
  CommentActionProps?: CommentProps;

  /**
   * Props to spread to Share action component
   * @default {inlineAction: false}
   */
  ShareActionProps?: ShareProps;
}

export default function Actions(props: ActionsProps): JSX.Element {
  // PROPS
  const {
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectTemplate = FeedObjectTemplateType.PREVIEW,
    hideVoteAction = false,
    hideShareAction = false,
    hideCommentAction = false,
    handleExpandActivities,
    VoteActionProps = {inlineAction: false},
    CommentActionProps = {inlineAction: false},
    ShareActionProps = {inlineAction: false}
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
      {!hideVoteAction && (
        <Grid item xs={columnWidth} className={classes.action}>
          <Vote feedObject={obj} feedObjectType={feedObjectType} {...VoteActionProps} />
        </Grid>
      )}
      {!hideCommentAction && (
        <Grid item xs={columnWidth} className={classes.action}>
          <Comment
            feedObject={obj}
            feedObjectType={feedObjectType}
            feedObjectTemplate={feedObjectTemplate}
            onCommentAction={handleExpandActivities}
            {...CommentActionProps}
          />
        </Grid>
      )}
      {!hideShareAction && (
        <Grid item xs={columnWidth} className={classes.action}>
          <Share feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} {...ShareActionProps} />
        </Grid>
      )}
    </Root>
  );
}
