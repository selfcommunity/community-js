import {CodeNode} from '@lexical/code';
import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ImageNode} from './ImageNode';
import {MentionNode} from './MentionNode';

const nodes = [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, HashtagNode, AutoLinkNode, LinkNode, ImageNode, MentionNode];

export default nodes;
