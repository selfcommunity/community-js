import React, {RefObject, useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {SCUserContext, SCUserContextType, useSCFetchCommentObject} from '@selfcommunity/core';
import Editor from '../../Editor';
import {TMUIRichTextEditorRef} from 'mui-rte';
import classNames from 'classnames';

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
  padding: '1px',
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  }
}));

export default function ReplyCommentObject({
  commentObjectId = null,
  commentObject = null,
  autoFocus = false,
  inline = false,
  onReply = null,
  ...rest
}: {
  commentObjectId?: number;
  commentObject?: SCCommentType;
  autoFocus?: boolean;
  onReply?: (comment) => void;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [html, setHtml] = useState('');
  let editor: RefObject<TMUIRichTextEditorRef> = React.createRef();
  const intl = useIntl();

  /**
   * When ReplyCommentObject is mount
   * if autoFocus === true focus on editor
   */
  useEffect(() => {
    autoFocus && handleEditorFocus();
  }, []);

  /**
   * Focus on editor
   */
  const handleEditorFocus = () => {
    editor.current.focus();
  };

  /**
   * Handle Replay
   */
  const handleReply = () => {
    onReply && onReply(html);
  };

  /**
   * Handle Editor change
   */
  const handleChangeText = (value: string): void => {
    setHtml(value);
  };

  /**
   * Render reply
   * @param obj
   */
  function renderReply(obj) {
    return (
      <ListItem alignItems="flex-start" classes={{root: classNames({[classes.commentChild]: !inline})}}>
        <ListItemAvatar>
          <Avatar alt={scUser.user.username} variant="circular" src={scUser.user.avatar} />
        </ListItemAvatar>
        <ListItemText
          disableTypography
          secondary={
            <>
              <Card classes={{root: classes.comment}} {...rest}>
                <Editor
                  onRef={(e) => {
                    editor = e;
                  }}
                  onChange={handleChangeText}
                />
              </Card>
              {!inline && (
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                    <Button variant={'text'} sx={{marginTop: '-1px'}} onClick={handleReply}>
                      {intl.formatMessage(messages.reply)}
                    </Button>
                  </Grid>
                </Box>
              )}
            </>
          }
        />
      </ListItem>
    );
  }

  /**
   * Render root object
   */
  return <Root elevation={0}>{renderReply(obj)}</Root>;
}
