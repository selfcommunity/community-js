import React, {FunctionComponent, RefObject, useEffect, useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, useIntl} from 'react-intl';
import MUIRichTextEditor, {TAutocompleteItem, TMUIRichTextEditorRef} from 'mui-rte';
import {Avatar, Box, ListItemAvatar, ListItemText} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCEditor';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(2),
  minHeight: 100
}));

const messages = defineMessages({
  placeholder: {
    id: 'ui.editor.placeholder',
    defaultMessage: 'ui.editor.placeholder'
  }
});

type TUser = {
  avatar: string;
  username: string;
  realName?: string;
};

const User: FunctionComponent<TUser> = (props) => {
  return (
    <>
      <ListItemAvatar>
        <Avatar alt={props.username} src={props.avatar}>
          {props.username.substr(0, 1)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.username} secondary={props.realName} />
    </>
  );
};

export default function Editor({
  className = '',
  defaultValue = '',
  readOnly = false,
  onChange = null,
  onRef = null
}: {
  className?: string;
  defaultValue?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRef?: (editor: RefObject<TMUIRichTextEditorRef>) => void;
}): JSX.Element {
  const editorId = useMemo(() => `editor${(Math.random() + 1).toString(36).substring(7)}`, []);

  // Refs
  const editor = useRef<TMUIRichTextEditorRef>(null);

  // INTL
  const intl = useIntl();

  /**
   * On mount if onRef in props
   * forward editor ref
   */
  useEffect(() => {
    onRef && onRef(editor);
  }, []);

  // Default editor content
  const content: string = useMemo(() => {
    const contentHTML = convertFromHTML(defaultValue);
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
    return JSON.stringify(convertToRaw(state));
  }, []);

  // UTILITY
  const searchMentions = async (query: string): Promise<TAutocompleteItem[]> => {
    const response: AxiosResponse<any> = await http.request({
      url: Endpoints.UserSearch.url(),
      method: Endpoints.UserSearch.method,
      params: {user: query, limit: 7}
    });
    return response.data.results.map((user: SCUserType) => {
      return {
        keys: [user.email, user.username, user.real_name],
        value: `${user.username}`,
        content: <User username={user.username} realName={user.real_name} avatar={user.avatar} />
      };
    });
  };

  // HANDLERS

  const handleChange = (editor: EditorState) => {
    onChange && onChange(draftToHtml(convertToRaw(editor.getCurrentContent())));
  };

  return (
    <Root className={className}>
      <MUIRichTextEditor
        id={editorId}
        readOnly={readOnly}
        label={intl.formatMessage(messages.placeholder)}
        onChange={handleChange}
        ref={editor}
        defaultValue={content}
        inlineToolbarControls={['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'link', 'clear']}
        toolbar={false}
        inlineToolbar={true}
        autocomplete={{
          strategies: [
            {
              asyncItems: searchMentions,
              triggerChar: '@'
            }
          ]
        }}
      />
    </Root>
  );
}
