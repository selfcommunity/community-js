import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {SCUserContext, SCUserContextType, SCUserType, useSCFetchCommentObject} from '@selfcommunity/core';
import Editor from '../../Editor';

const messages = defineMessages({
  reply: {
    id: 'ui.commentObject.reply',
    defaultMessage: 'ui.commentObject.reply'
  }
});

const PREFIX = 'SCReplyCommentObject';

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
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  }
}));

export default function ReplyCommentObject({
  commentObjectId = null,
  commentObject = null,
  onReply = null,
  ...rest
}: {
  commentObjectId?: number;
  commentObject?: SCCommentType;
  onReply?: (comment) => void;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const intl = useIntl();

  function renderReply(obj) {
    return (
      <React.Fragment>
        <ListItem button={false} alignItems="flex-start" classes={{root: classes.commentChild}}>
          <ListItemAvatar>
            <Avatar alt={scUser.user.username} variant="circular" src={scUser.user.avatar} />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            secondary={
              <>
                <Card classes={{root: classes.comment}} {...rest}>
                  <CardContent>
                    <Editor />
                  </CardContent>
                </Card>
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                    <Button variant={'text'} sx={{marginTop: '-1px'}} onClick={onReply}>
                      {intl.formatMessage(messages.reply)}
                    </Button>
                  </Grid>
                </Box>
              </>
            }
          />
        </ListItem>
      </React.Fragment>
    );
  }

  /**
   * Render object
   */
  return <Root elevation={0}>{renderReply(obj)}</Root>;
}
