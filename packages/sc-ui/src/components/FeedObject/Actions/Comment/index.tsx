import React from 'react';
import {defineMessages, injectIntl, useIntl} from 'react-intl';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
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

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function Comment({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  withAction = false,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  withAction: boolean;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();

  return (
    <Root {...rest}>
      <Button variant="text" size="small" component={Link} to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})} sx={{height: 32}}>
        <Typography variant={'body2'}>{`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}</Typography>
      </Button>
      {withAction && (
        <React.Fragment>
          <Divider />
          <Tooltip title={`${intl.formatMessage(messages.comment)}`}>
            <Button component={Link} to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})}>
              <CommentIcon fontSize={'large'} />
            </Button>
          </Tooltip>
        </React.Fragment>
      )}
    </Root>
  );
}
