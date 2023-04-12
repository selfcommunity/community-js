import React from 'react';
import {OnChangePlugin as LexicalOnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {$getRoot, EditorState, LexicalEditor} from 'lexical';
import {ImageNode} from '../nodes/ImageNode';
import {MentionNode} from '../nodes/MentionNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {CodeNode} from '@lexical/code';
import {$generateHtmlFromNodes} from '@lexical/html';

const IS_BOLD = 1;
const IS_ITALIC = 2;

const convertText = (node) => {
  if (node.getFormat() === IS_BOLD) {
    return `<strong>${node.__text}</strong>`;
  } else if (node.getFormat() === IS_ITALIC) {
    return `<em>${node.__text}</em>`;
  }
  return `<span>${node.__text}</span>`;
};

const convertNode = (node, children) => {
  switch (node.getType()) {
    case ImageNode.getType():
      return `<img src="${node.__src}" alt="${node.__altText}" width="${node.__width}" height="${node.__height}" style="max-width: ${node.__maxWidth}px;" />`;
    case MentionNode.getType():
      return `<mention id="${node.__user.id}" ext-id="${node.__user.ext_id}">@${node.__user.username}</mention>`;
    case AutoLinkNode.getType():
    case LinkNode.getType():
      return `<a href="${node.__url}">${node.__url}</a>`;
    case 'list':
      return `<${node.__tag}>${children}</${node.__tag}>`;
    case 'listitem':
      return `<li>${node.__value}</li>`;
    case QuoteNode.getType():
      return `<blockquote>${children}</blockquote>`;
    case CodeNode.getType():
      return `<pre>${children}</pre>`;
    case 'linebreak':
      return `<br/>`;
    case 'text':
      return convertText(node);
    case HeadingNode.getType():
      return `<${node.__tag}>${children}</${node.__tag}>`;
    case 'paragraph':
      return `<p>${children ? children : '<br/>'}</p>`;
    case 'root':
      return children;
    default:
      return '';
  }
};

const $toHtml = (node) => {
  let html = '';

  // Create html for child nodes
  node.getChildren && node.getChildren().map((child) => (html += $toHtml(child)));

  // Return new html
  return convertNode(node, html);
};

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
