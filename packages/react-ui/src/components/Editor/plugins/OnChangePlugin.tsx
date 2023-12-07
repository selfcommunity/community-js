import React from 'react';
import { OnChangePlugin as LexicalOnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

const OnChangePlugin = (props): JSX.Element => {
  // PROPS
  const {onChange} = props;

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      onChange(htmlString);
    });
  };

  return <LexicalOnChangePlugin onChange={handleChange} />;
};

export default OnChangePlugin;
