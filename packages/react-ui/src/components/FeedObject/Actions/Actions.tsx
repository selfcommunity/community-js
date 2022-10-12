import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote, {VoteProps} from './Vote';
import Comment, {CommentProps} from './Comment';
import Share, {ShareProps} from './Share';
import {SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {SCFeatures, useSCFetchFeedObject, useSCPreferences} from '@selfcommunity/react-core';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Reaction from './Reaction';

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

export default function Actions(inProps: ActionsProps): JSX.Element {
  // PROPS
  const props: ActionsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectTemplate = SCFeedObjectTemplateType.PREVIEW,
    hideVoteAction = false,
    hideShareAction = false,
    hideCommentAction = false,
    handleExpandActivities,
    VoteActionProps = {},
    CommentActionProps = {},
    ShareActionProps = {}
  } = props;

  // PREFERENCES
  const scPreferences = useSCPreferences();

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const reactionsEnabled = scPreferences.features.includes(SCFeatures.REACTION);

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
          {reactionsEnabled ? (
            <Reaction feedObject={obj} feedObjectType={feedObjectType} {...VoteActionProps} />
          ) : (
            <Vote feedObject={obj} feedObjectType={feedObjectType} {...VoteActionProps} />
          )}
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
