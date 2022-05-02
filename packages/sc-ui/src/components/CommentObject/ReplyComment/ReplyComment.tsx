import React, {RefObject, useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget, {WidgetProps} from '../../Widget';
import {defineMessages, useIntl} from 'react-intl';
import {Avatar, Stack} from '@mui/material';
import {SCUserContext, SCUserContextType} from '@selfcommunity/core';
import Editor, {TRichTextEditorRef} from '../../Editor';
import classNames from 'classnames';
import {LoadingButton} from '@mui/lab';
import useThemeProps from '@mui/material/styles/useThemeProps';
import BaseItemButton from '../../../shared/BaseItemButton';

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
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  buttonReply: `${PREFIX}-button-reply`,
  buttonSave: `${PREFIX}-button-save`,
  buttonCancel: `${PREFIX}-button-cancel`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: '1px',
  overflow: 'visible',
  [`&.${classes.root}`]: {
    '& .SCBaseItemButton-content': {
      alignItems: 'flex-start',
      '& .SCBaseItemButton-text': {
        marginTop: 0,
        '& .SCBaseItemButton-secondary': {
          overflow: 'visible'
        }
      }
    }
  },
  [`& .${classes.comment}`]: {
    overflow: 'visible'
  },
  [`& .${classes.actions}`]: {
    marginLeft: theme.spacing(),
    paddingBottom: theme.spacing()
  }
}));

export interface ReplyCommentObjectProps extends WidgetProps {
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
   * @default false
   */
  readOnly?: boolean;

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

export default function ReplyCommentObject(inProps: ReplyCommentObjectProps): JSX.Element {
  // PROPS
  const props: ReplyCommentObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    elevation = 0,
    autoFocus = false,
    inline = false,
    onReply,
    onSave,
    onCancel,
    readOnly = false,
    text = '',
    WidgetProps = {variant: 'outlined'},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const intl = useIntl();

  // RETRIEVE OBJECTS
  const [html, setHtml] = useState(text);

  // REFS
  let editor: RefObject<TRichTextEditorRef> = React.createRef();

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
  const isEditorEmpty = useMemo(
    () => (): boolean => {
      const _html = html.trim();
      return _html === '' || _html === '<p></p>';
    },
    [html]
  );

  // RENDER
  return (
    <Root
      {...rest}
      disableTypography
      elevation={elevation}
      ButtonBaseProps={{disableTouchRipple: true, onClick: handleEditorFocus, component: 'div'}}
      className={classNames(classes.root, className)}
      image={
        !scUserContext.user ? (
          <Avatar variant="circular" className={classes.avatar} />
        ) : (
          <Avatar alt={scUserContext.user.username} variant="circular" src={scUserContext.user.avatar} classes={{root: classes.avatar}} />
        )
      }
      secondary={
        <Widget className={classes.comment} {...WidgetProps}>
          <Editor
            onRef={(e) => {
              editor = e;
            }}
            onChange={handleChangeText}
            defaultValue={html}
            readOnly={readOnly}
          />
          {!isEditorEmpty() && (
            <Stack direction="row" spacing={2} className={classes.actions}>
              {onReply && (
                <LoadingButton variant="outlined" size="small" onClick={handleReply} loading={readOnly} className={classes.buttonReply}>
                  {intl.formatMessage(messages.reply)}
                </LoadingButton>
              )}
              {onSave && (
                <>
                  {onCancel && (
                    <LoadingButton variant={'text'} size="small" onClick={handleCancel} loading={readOnly} color="inherit" className={classes.buttonCancel}>
                      {intl.formatMessage(messages.cancel)}
                    </LoadingButton>
                  )}
                  <LoadingButton variant="outlined" size="small" onClick={handleSave} loading={readOnly} className={classes.buttonSave}>
                    {intl.formatMessage(messages.save)}
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
