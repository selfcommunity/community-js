import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {BLUR_COMMAND, COMMAND_PRIORITY_EDITOR} from 'lexical';

interface OnBlurPluginProps {
  onBlur?: (event: FocusEvent) => void;
}
const OnBlurPlugin = ({onBlur}: OnBlurPluginProps) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      (event: FocusEvent) => {
        onBlur && onBlur(event);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, []);

  return null;
};

export default OnBlurPlugin;
