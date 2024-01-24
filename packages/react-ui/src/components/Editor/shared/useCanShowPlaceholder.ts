/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {LexicalEditor} from 'lexical';

import {$canShowPlaceholderCurry} from '@lexical/text';
import {mergeRegister} from '@lexical/utils';
import {useState} from 'react';
import {useIsomorphicLayoutEffect} from '@selfcommunity/react-core';

function canShowPlaceholderFromCurrentEditorState(editor: LexicalEditor): boolean {
  return editor.getEditorState().read($canShowPlaceholderCurry(editor.isComposing()));
}

export function useCanShowPlaceholder(editor: LexicalEditor): boolean {
  const [canShowPlaceholder, setCanShowPlaceholder] = useState(() => canShowPlaceholderFromCurrentEditorState(editor));

  useIsomorphicLayoutEffect(() => {
    function resetCanShowPlaceholder() {
      const currentCanShowPlaceholder = canShowPlaceholderFromCurrentEditorState(editor);
      setCanShowPlaceholder(currentCanShowPlaceholder);
    }
    resetCanShowPlaceholder();
    return mergeRegister(
      editor.registerUpdateListener(() => {
        resetCanShowPlaceholder();
      }),
      editor.registerEditableListener(() => {
        resetCanShowPlaceholder();
      })
    );
  }, [editor]);

  return canShowPlaceholder;
}
