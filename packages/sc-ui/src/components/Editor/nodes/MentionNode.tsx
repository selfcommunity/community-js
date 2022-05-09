import {EditorConfig, LexicalNode, NodeKey, TextNode} from 'lexical';
import {SCUserType} from '@selfcommunity/core';

function convertMentionElement(domNode) {
  const mention = domNode;
  return {
    node: createMentionNode({
      avatar: '',
      bio: '',
      date_joined: undefined,
      description: '',
      gender: '',
      location: '',
      real_name: '',
      reputation: 0,
      role: '',
      status: '',
      tags: undefined,
      website: '',
      id: domNode.getAttribute('id'),
      ext_id: domNode.getAttribute('ext_id'),
      username: domNode.innerText.replace('@', '')
    })
  };
}

export class MentionNode extends TextNode {
  __user: SCUserType;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__user, node.__text, node.__key);
  }

  constructor(user: SCUserType, text?: string, key?: NodeKey) {
    super(text ?? `@${user.username}`, key);
    this.__user = user;
  }

  createDOM(config) {
    const tag = 'mention';
    const dom = document.createElement(tag);
    dom.setAttribute('id', `${this.__user.id}`);
    dom.setAttribute('ext-id', `${this.__user.ext_id}`);
    dom.innerText = this.__text;

    return dom;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const inner: null | HTMLElement = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);
    return false;
  }

  static importDOM() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const dom = TextNode.importDOM();
    return {
      mention: (node) => ({
        conversion: convertMentionElement,
        priority: 0
      }),
      ...dom
    };
  }

  isTextEntity(): true {
    return true;
  }
}

export function createMentionNode(user: SCUserType): MentionNode {
  const mentionNode = new MentionNode(user);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}

export function isMentionNode(node?: LexicalNode): boolean {
  return node.getType() === 'mention';
}
