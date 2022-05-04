import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export type ApiRef = {
  focus: () => void;
};

const ApiPlugin: ForwardRefRenderFunction<ApiRef, any> = (props, ref: ForwardedRef<ApiRef>): JSX.Element => {
  // HOOKS
  const [editor] = useLexicalComposerContext();

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    focus: () => {
      editor.focus();
    }
  }));

  return null;
};

export default forwardRef(ApiPlugin);
