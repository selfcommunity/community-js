import React from 'react';
import {defineMessages, injectIntl} from 'react-intl';
import {Button, Divider, Typography} from '@mui/material';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import {SCFeedObjectType, SCFeedObjectTypologyType, SCRoutingContextType, useSCFetchFeedObject, useSCRouting, Link} from '@selfcommunity/core';

const messages = defineMessages({
  comments: {
    id: 'feedObject.audience.comments',
    defaultMessage: 'feedObject.audience.comments'
  }
});

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

  return (
    <React.Fragment>
      <Button variant="text" size="small" component={Link} to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})}>
        <Typography variant={'body2'}>{`${obj.comment_count} Comments`}</Typography>
      </Button>
      {withAction && (
        <React.Fragment>
          <Divider />
          <Button component={Link} to={scRoutingContext.url(feedObjectType.toLowerCase(), {id: obj.id})}>
            <CommentIcon fontSize="small" />
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
