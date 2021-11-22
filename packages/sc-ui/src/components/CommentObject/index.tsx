import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import Bullet from '../../shared/Bullet';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {useSCFetchCommentObject} from '@selfcommunity/core';
import classNames from 'classnames';

const messages = defineMessages({
  reply: {
    id: 'ui.commentObject.reply',
    defaultMessage: 'ui.commentObject.reply'
  },
  like: {
    id: 'ui.commentObject.like',
    defaultMessage: 'ui.commentObject.like'
  }
});

const PREFIX = 'SCCommentsObject';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  commentChild: `${PREFIX}-commentChild`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  },
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  }
}));

export default function CommentObject({
  id = null,
  commentObject = null,
  ...rest
}: {
  id?: number;
  commentObject?: SCCommentType;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchCommentObject({id, commentObject});
  const intl = useIntl();

  function renderComment(comment) {
    return [
      <ListItem button={false} alignItems="flex-start" classes={{root: classNames({[classes.commentChild]: Boolean(comment.parent)})}}>
        <ListItemAvatar>
          <Avatar alt={obj.author.username} variant="circular" src={comment.author.avatar} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <>
              <Card classes={{root: classes.comment}}>
                <CardContent>
                  <Typography component="span" sx={{display: 'inline'}} gutterBottom color="primary">
                    {comment.author.username}
                  </Typography>
                  <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: comment.summary}}></Typography>
                </CardContent>
              </Card>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <TimeAgo datetime={comment.added_at} />
                  <Bullet sx={{paddingLeft: '10px', paddingTop: '1px'}} />
                  <Button variant={'text'} sx={{marginTop: '-1px'}}>
                    {intl.formatMessage(messages.like)}
                  </Button>
                  <Bullet sx={{paddingTop: '1px'}} />
                  <Button variant={'text'} sx={{marginTop: '-1px'}}>
                    {intl.formatMessage(messages.reply)}
                  </Button>
                </Grid>
              </Box>
            </>
          }
        />
      </ListItem>,
      <>{renderLatestComment(comment)}</>
    ];
  }

  function renderLatestComment(comment) {
    console.log(comment);
    return <>{comment.latest_comments?.map((lc: SCCommentType) => renderComment(lc))}</>;
  }

  /**
   * Render comments
   */
  let comment;
  if (obj) {
    comment = renderComment(obj);
  } else {
    comment = <FeedObjectSkeleton elevation={0} />;
  }

  /**
   * Render object
   */
  return (
    <Root elevation={0} {...rest}>
      {comment}
    </Root>
  );
}
