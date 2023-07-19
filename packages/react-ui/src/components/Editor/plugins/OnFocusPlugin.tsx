import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND} from 'lexical';

interface OnFocusPluginProps {
  onFocus?: (event: FocusEvent) => void;
}
const OnFocusPlugin = ({onFocus}: OnFocusPluginProps) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      FOCUS_COMMAND,
      (event: FocusEvent) => {
        onFocus && onFocus(event);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, []);

  return null;
};

export default OnFocusPlugin;
