import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ImageNode} from './ImageNode';
import {MentionNode} from './MentionNode';
import {TextNode} from 'lexical';

const nodes = [HeadingNode, ListNode, ListItemNode, QuoteNode, TextNode, HashtagNode, AutoLinkNode, LinkNode, ImageNode, MentionNode];

export default nodes;
