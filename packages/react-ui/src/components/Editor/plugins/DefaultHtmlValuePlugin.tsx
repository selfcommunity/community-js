import React, {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getRoot, $getSelection} from 'lexical';
import {$generateNodesFromDOM} from '@lexical/html';

function DefaultHtmlValuePlugin({defaultValue}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      // See:
      // https://github.com/facebook/lexical/issues/1834
      // https://github.com/facebook/lexical/issues/2328

      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(defaultValue, 'text/html');

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);

      // Select the root
      $getRoot().select();

      // Insert them at a selection.
      const selection = $getSelection();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      selection.insertNodes(nodes);
    });
  }, []);

  return null;
}

export default DefaultHtmlValuePlugin;
