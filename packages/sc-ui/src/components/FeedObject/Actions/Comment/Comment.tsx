import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Box, Button, Divider, Tooltip, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {SCFeedObjectType, SCFeedObjectTypologyType, SCRoutingContextType, useSCFetchFeedObject, useSCRouting, Link} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import {FeedObjectTemplateType} from '../../../../types/feedObject';
import classNames from 'classnames';

const messages = defineMessages({
  comments: {
    id: 'ui.feedObject.comment.comments',
    defaultMessage: 'ui.feedObject.comment.comments'
  },
  comment: {
    id: 'ui.feedObject.comment.comment',
    defaultMessage: 'ui.feedObject.comment.comment'
  }
});

const PREFIX = 'SCCommentObject';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  viewCommentsButton: `${PREFIX}-view-comments-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.divider}`]: {
    borderBottom: 0
  },
  [`& .${classes.viewCommentsButton}`]: {
    height: 32,
    fontSize: 15,
    textTransform: 'capitalize',
    '& p': {
      fontSize: '0.9rem'
    }
  }
}));

export interface CommentProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  id?: number;

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
   * Manages action (if present)
   * @default false
   */
  withAction: boolean;

  /**
   * Handles action view all comments click
   * @default null
   */
  onViewCommentsAction?: () => any;

  /**
   * Handles action comment click
   * @default null
   */
  onCommentAction?: () => any;

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Comment(props: CommentProps): JSX.Element {
  // PROPS
  const {
    className,
    id,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectTemplate = FeedObjectTemplateType,
    withAction = false,
    onViewCommentsAction,
    onCommentAction,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders comment action
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {onViewCommentsAction ? (
        <Button variant="text" size="small" sx={{height: 32}} onClick={onViewCommentsAction} color="inherit">
          <Typography variant={'body2'}>{`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}</Typography>
        </Button>
      ) : (
        <>
          {feedObjectTemplate === FeedObjectTemplateType.DETAIL ? (
            <Typography variant={'body2'} sx={{mt: '7px', mb: '6px'}}>
              {`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}
            </Typography>
          ) : (
            <Button
              color="inherit"
              variant="text"
              size="small"
              component={Link}
              to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})}
              classes={{root: classes.viewCommentsButton}}>
              <Typography variant={'body2'}>{`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}</Typography>
            </Button>
          )}
        </>
      )}
      {withAction && (
        <React.Fragment>
          <Divider className={classes.divider} />
          <Tooltip title={`${intl.formatMessage(messages.comment)}`}>
            <Button onClick={onCommentAction} color="inherit">
              <Icon fontSize={'large'}>chat_bubble_outline</Icon>
            </Button>
          </Tooltip>
        </React.Fragment>
      )}
    </Root>
  );
}
