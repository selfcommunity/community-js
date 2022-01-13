import React from 'react';
import {defineMessages, injectIntl, useIntl} from 'react-intl';
import {Box, Button, Divider, Tooltip, Typography} from '@mui/material';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import {SCFeedObjectType, SCFeedObjectTypologyType, SCRoutingContextType, useSCFetchFeedObject, useSCRouting, Link} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';

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

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
   * Manages action (if present)
   * @default false
   */
  withAction: boolean;
  /**
   * Handles action click
   * @default null
   */
  onActionCLick?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Comment(props: CommentProps): JSX.Element {
  // PROPS
  const {
    className = null,
    id = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    withAction = false,
    onActionCLick = null,
    ...rest
  } = props;

  //STATE
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});

  //CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();

  /**
   * Renders comment action
   */
  return (
    <Root className={className} {...rest}>
      <Button variant="text" size="small" component={Link} to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})} sx={{height: 32}}>
        <Typography variant={'body2'}>{`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}</Typography>
      </Button>
      {withAction && (
        <React.Fragment>
          <Divider />
          <Tooltip title={`${intl.formatMessage(messages.comment)}`}>
            <Button onClick={() => onActionCLick()}>
              <CommentIcon fontSize={'large'} />
            </Button>
          </Tooltip>
        </React.Fragment>
      )}
    </Root>
  );
}
