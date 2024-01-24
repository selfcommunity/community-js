import {useEffect, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND} from 'lexical';

const useEditorFocus = () => {
  const [editor] = useLexicalComposerContext();
  const [hasFocus, setFocus] = useState(false);

  useEffect(
    () =>
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setFocus(false);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  useEffect(
    () =>
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setFocus(true);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  return hasFocus;
};

export {useEditorFocus};
