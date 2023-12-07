import React, {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createParagraphNode, $getRoot, $insertNodes} from 'lexical';
import {$generateNodesFromDOM} from '@lexical/html';

function DefaultHtmlValuePlugin({defaultValue}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!defaultValue) {
      return;
    }
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
      const root = $getRoot();

      // Add nodes
      if (nodes.length <= 1) {
        const paragraphNode = $createParagraphNode();
        nodes.forEach((node) => paragraphNode.append(node));
        root.getFirstChild().replace(paragraphNode).selectEnd();
      } else {
        root.getFirstChild().remove();
        nodes.forEach((node) => root.append(node));
        root.selectEnd();
      }
    });
  }, []);

  return null;
}

export default DefaultHtmlValuePlugin;
