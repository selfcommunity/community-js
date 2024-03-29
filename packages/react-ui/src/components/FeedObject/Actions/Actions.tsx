import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote, {VoteProps} from './Vote';
import Comment, {CommentProps} from './Comment';
import Share, {ShareProps} from './Share';
import {SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {useSCFetchFeedObject} from '@selfcommunity/react-core';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import classNames from 'classnames';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-actions-root`,
  action: `${PREFIX}-actions-action`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'ActionsRoot'
})(() => ({}));

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
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Feed Object template type
   * @default 'preview'
   */
  feedObjectTemplate?: SCFeedObjectTemplateType;

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
    feedObject,
    feedObjectId = feedObject?.id,
    feedObjectType = feedObject?.type,
    feedObjectTemplate = SCFeedObjectTemplateType.PREVIEW,
    hideVoteAction = false,
    hideShareAction = false,
    hideCommentAction = false,
    handleExpandActivities,
    VoteActionProps = {},
    CommentActionProps = {},
    ShareActionProps = {}
  } = props;

  // STATE
  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

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
          <Vote feedObjectId={feedObjectId || obj.id} feedObject={obj} feedObjectType={feedObjectType || obj.type} {...VoteActionProps} />
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
