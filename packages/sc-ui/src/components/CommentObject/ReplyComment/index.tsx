import React, {RefObject, useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {SCUserContext, SCUserContextType, useSCFetchCommentObject} from '@selfcommunity/core';
import Editor from '../../Editor';
import {TMUIRichTextEditorRef} from 'mui-rte';
import classNames from 'classnames';
import {LoadingButton} from '@mui/lab';

const messages = defineMessages({
  reply: {
    id: 'ui.commentObject.replyComment.reply',
    defaultMessage: 'ui.commentObject.replyComment.reply'
  },
  save: {
    id: 'ui.commentObject.replyComment.save',
    defaultMessage: 'ui.commentObject.replyComment.save'
  },
  cancel: {
    id: 'ui.commentObject.replyComment.cancel',
    defaultMessage: 'ui.commentObject.replyComment.cancel'
  }
});

const PREFIX = 'SCReplyCommentObject';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  commentChild: `${PREFIX}-commentChild`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: '1px',
  overflow: 'auto',
  [`& .${classes.comment}`]: {
    overflow: 'visible'
  },
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  },
  [`& .${classes.avatarWrap}`]: {
    minWidth: 46
  },
  [`& .${classes.avatar}`]: {
    width: 35,
    height: 35
  }
}));

export interface ReplyCommentObjectProps {
  /**
   * Id of the comment object
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment object
   * @default null
   */
  commentObject?: SCCommentType;

  /**
   * Bind focuse on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Callback invoked after reply
   * @param comment
   */
  onReply?: (comment) => void;

  /**
   * Callback invoked after save/edit
   * @param comment
   */
  onSave?: (comment) => void;

  /**
   * Callback invoked after disccard save/edit
   * @param comment
   */
  onCancel?: () => void;

  /**
   * Disable component
   * @default false
   */
  readOnly?: boolean;

  /**
   * Initial content
   * @default ''
   */
  text?: string;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function ReplyCommentObject(props: ReplyCommentObjectProps): JSX.Element {
  // PROPS
  const {commentObjectId, commentObject, autoFocus = false, inline = false, onReply, onSave, onCancel, readOnly = false, text = '', ...rest} = props;

  // CONTEXT
  const scUser: SCUserContextType = useContext(SCUserContext);
  const intl = useIntl();

  // RETRIVE OBJECTS
  const {obj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [html, setHtml] = useState(text);

  // REFS
  let editor: RefObject<TMUIRichTextEditorRef> = React.createRef();

  /**
   * When ReplyCommentObject is mount
   * if autoFocus === true focus on editor
   */
  useEffect(() => {
    autoFocus && handleEditorFocus();
  }, [autoFocus]);

  /**
   * Focus on editor
   */
  const handleEditorFocus = (): void => {
    editor.current.focus();
  };

  /**
   * Handle Replay
   */
  const handleReply = (): void => {
    onReply && onReply(html);
  };

  /**
   * Handle Save
   */
  const handleSave = (): void => {
    onSave && onSave(html);
  };

  /**
   * Handle cancel save
   */
  const handleCancel = (): void => {
    onCancel && onCancel();
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
    () => (): boolean => {
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
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Avatar alt={scUser.user.username} variant="circular" src={scUser.user.avatar} classes={{root: classes.avatar}} />
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
                  defaultValue={html}
                  readOnly={readOnly}
                />
              </Card>
              {!isEditorEmpty() && (
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  {onReply && (
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                      <LoadingButton variant={'text'} sx={{marginTop: '-1px'}} onClick={handleReply} loading={readOnly}>
                        {intl.formatMessage(messages.reply)}
                      </LoadingButton>
                    </Grid>
                  )}
                  {onSave && (
                    <>
                      <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                        <LoadingButton variant={'text'} sx={{marginTop: '-1px'}} onClick={handleSave} loading={readOnly}>
                          {intl.formatMessage(messages.save)}
                        </LoadingButton>
                      </Grid>
                      {onCancel && (
                        <Grid component="span" item={true} sm="auto" container direction="row" alignItems="right">
                          <LoadingButton variant={'text'} sx={{marginTop: '-1px'}} onClick={handleCancel} loading={readOnly}>
                            {intl.formatMessage(messages.cancel)}
                          </LoadingButton>
                        </Grid>
                      )}
                    </>
                  )}
                </Box>
              )}
            </>
          }
        />
      </ListItem>
    );
  }

  /**
   * Renders root object
   */
  return <Root elevation={0}>{renderReply(obj)}</Root>;
}
