import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ImageNode} from './ImageNode';
import {MentionNode} from './MentionNode';
import {HashtagNode} from './HashtagNode';
import {TextNode} from 'lexical';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';

const nodes = [
  HorizontalRuleNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  TextNode,
  // HashtagNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
  MentionNode
];

export default nodes;
