import React, { RefObject, useContext, useEffect, useMemo, useState } from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {SCUserContext, SCUserContextType, useSCFetchCommentObject} from '@selfcommunity/core';
import Editor from '../../Editor';
import {TMUIRichTextEditorRef} from 'mui-rte';
import classNames from 'classnames';
import {LoadingButton} from '@mui/lab';

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
  isLoading = false,
  ...rest
}: {
  commentObjectId?: number;
  commentObject?: SCCommentType;
  autoFocus?: boolean;
  onReply?: (comment) => void;
  isLoading?: boolean;
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
    setHtml('');
  };

  /**
   * Handle Editor change
   */
  const handleChangeText = (value: string): void => {
    setHtml(value);
  };

  /**
   * Check if editor is empty
   */
  const isEditorEmpty = useMemo(
    () => () => {
      const _html = html.trim();
      return _html === '' || _html === '<p></p>';
    },
    [html]
  );

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
                  defaultValue={html}
                  onChange={handleChangeText}
                />
              </Card>
              {!isEditorEmpty() && (
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                    <LoadingButton variant={'text'} sx={{marginTop: '-1px'}} onClick={handleReply} loading={isLoading}>
                      {intl.formatMessage(messages.reply)}
                    </LoadingButton>
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
