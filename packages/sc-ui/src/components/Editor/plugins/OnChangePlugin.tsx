import React from 'react';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import {EditorState, LexicalEditor} from 'lexical';

const OnChangePlugin = (props): JSX.Element => {
  // PROPS
  const {onChange} = props;

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    onChange(editor.getRootElement().innerHTML);
  };

  return <LexicalOnChangePlugin onChange={handleChange} />;
};

export default OnChangePlugin;
