import React, {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget, {WidgetProps} from '../Widget';
import {FormattedMessage} from 'react-intl';
import {Avatar, Stack} from '@mui/material';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import Editor, {EditorRef} from '../Editor';
import classNames from 'classnames';
import {LoadingButton} from '@mui/lab';
import BaseItem from '../../shared/BaseItem';
import UserAvatar from '../../shared/UserAvatar';
import {PREFIX} from '../CommentObject/constants';

const classes = {
  root: `${PREFIX}-reply-root`,
  comment: `${PREFIX}-reply-comment`,
  hasValue: `${PREFIX}-reply-has-value`,
  avatar: `${PREFIX}-reply-avatar`,
  actions: `${PREFIX}-reply-actions`,
  buttonReply: `${PREFIX}-reply-button-reply`,
  buttonSave: `${PREFIX}-reply-button-save`,
  buttonCancel: `${PREFIX}-reply-button-cancel`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'ReplyRoot'
})(() => ({}));

export interface CommentObjectReplyProps extends WidgetProps {
  /**
   * Bind focus on mount
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
   * @default true
   */
  editable?: boolean;

  /**
   * Initial content
   * @default ''
   */
  text?: string;

  /**
   * Initial content
   * @default {variant: 'outlined'}
   */
  WidgetProps?: WidgetProps;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 *> API documentation for the Community-JS Comment Object Reply component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentObjectReply} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `CommentObject-reply-root` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.CommentObject-reply-root|Styles applied to the root element.|
 |comment|.SCCommentObject-reply-comment|Styles applied to comment element.|
 |hasValue|.SCCommentObject-reply-has-value|Styles applied to the comment element when editor is not empty.|
 |avatar|.SCCommentObject-reply-avatar|Styles applied to the avatar element.|
 |actions|.SCCommentObject-reply-actions|Styles applied to the actions section.|
 |buttonReply|.SCCommentObject-reply-button-reply|Styles applied to reply button element.|
 |buttonSave|.SCCommentObject-reply-button-save|Styles applied to save button element.|
 |buttonCancel|.SCCommentObject-reply-button-cancel|Styles applied to the cancel button element.|

 * @param props
 */

export default function CommentObjectReply(props: CommentObjectReplyProps): JSX.Element {
  // PROPS
  const {
    id = 'CommentObjectReply',
    className,
    elevation = 0,
    autoFocus = false,
    onReply,
    onSave,
    onCancel,
    editable = true,
    text = '',
    WidgetProps = {variant: 'outlined'},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // RETRIEVE OBJECTS
  const [html, setHtml] = useState(text);

  // REFS
  let editor: RefObject<EditorRef> = useRef<EditorRef>();

  /**
   * When CommentObjectReply is mount
   * if autoFocus === true focus on editor
   */
  useEffect(() => {
    autoFocus && handleEditorFocus();
  }, [autoFocus]);

  /**
   * Focus on editor
   */
  const handleEditorFocus = (): void => {
    if (editor.current) {
      editor.current.focus();
    }
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
  const isEditorEmpty = useMemo((): boolean => {
    const _html = html.trim();
    return _html === '' || _html === '<p class="SCEditor-paragraph"></p>' || _html === '<p class="SCEditor-paragraph"><br></p>';
  }, [html]);

  // RENDER
  return (
    <Root
      id={id}
      {...rest}
      disableTypography
      onClick={handleEditorFocus}
      elevation={elevation}
      className={classNames(classes.root, className)}
      image={
        !scUserContext.user ? (
          <Avatar variant="circular" className={classes.avatar} />
        ) : (
          <UserAvatar hide={!scUserContext.user.community_badge}>
            <Avatar alt={scUserContext.user.username} variant="circular" src={scUserContext.user.avatar} classes={{root: classes.avatar}} />
          </UserAvatar>
        )
      }
      secondary={
        <Widget className={classNames(classes.comment, {[classes.hasValue]: !isEditorEmpty})} {...WidgetProps}>
          <Editor ref={editor} onChange={handleChangeText} defaultValue={html} editable={editable} uploadImage />
          {!isEditorEmpty && (
            <Stack direction="row" spacing={2} className={classes.actions}>
              {onReply && (
                <LoadingButton variant="outlined" size="small" onClick={handleReply} loading={!editable} className={classes.buttonReply}>
                  <FormattedMessage id="ui.commentObject.replyComment.reply" defaultMessage="ui.commentObject.replyComment.reply" />
                </LoadingButton>
              )}
              {onSave && (
                <>
                  {onCancel && (
                    <LoadingButton
                      variant={'text'}
                      size="small"
                      onClick={handleCancel}
                      disabled={!editable}
                      color="inherit"
                      className={classes.buttonCancel}>
                      <FormattedMessage id="ui.commentObject.replyComment.cancel" defaultMessage="ui.commentObject.replyComment.cancel" />
                    </LoadingButton>
                  )}
                  <LoadingButton variant="outlined" size="small" onClick={handleSave} loading={!editable} className={classes.buttonSave}>
                    <FormattedMessage id="ui.commentObject.replyComment.save" defaultMessage="ui.commentObject.replyComment.save" />
                  </LoadingButton>
                </>
              )}
            </Stack>
          )}
        </Widget>
      }
    />
  );
}
