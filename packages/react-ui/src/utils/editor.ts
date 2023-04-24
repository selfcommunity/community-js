import {$isAtNodeEnd} from '@lexical/selection';
import {ElementNode, RangeSelection, TextNode} from 'lexical';

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

/**
 * Extract id of hashtags from html text
 * @param html
 */
export function extractHashtags(html): string[] {
  return Array.from(html.matchAll(/<hashtag id="(?<id>[0-9]+)">#(?<name>[^<>]+)<\/hashtag>/g)).map((match: any) => match.groups.id);
}
