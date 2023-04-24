import {DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread, TextNode} from 'lexical';
import {SCCategoryType} from '@selfcommunity/types';
import {DOMConversionMap} from 'lexical/LexicalNode';

function convertHashtagElement(domNode) {
  const hashtag = domNode;
  return {
    node: createHashtagNode({
      id: hashtag.getAttribute('id'),
      name: hashtag.innerText.replace('#', '')
    })
  };
}

export type SerializedHashtagNode = Spread<
  {
    category: SCCategoryType;
    type: 'hashtag';
    version: 1;
  },
  SerializedTextNode
>;

export class HashtagNode extends TextNode {
  __category: SCCategoryType;

  static getType(): string {
    return 'hashtag';
  }

  static clone(node: HashtagNode): HashtagNode {
    return new HashtagNode(node.__category, node.__text, node.__key);
  }

  constructor(category: SCCategoryType, text?: string, key?: NodeKey) {
    super(text ?? `#${category.name}`, key);
    this.__category = category;
  }

  createDOM(config) {
    const tag = 'hashtag';
    const dom = document.createElement(tag);
    dom.setAttribute('id', `${this.__category.id}`);
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

  static importDOM(): DOMConversionMap | null {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const dom = TextNode.importDOM();
    return {
      hashtag: (node) => ({
        conversion: convertHashtagElement,
        priority: 0
      }),
      ...dom
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('hashtag');
    element.setAttribute('id', `${this.__category.id}`);
    element.textContent = `#${this.__category.name}`;
    return {element};
  }

  isTextEntity(): true {
    return true;
  }

  static importJSON(serializedNode: SerializedHashtagNode): HashtagNode {
    const {category} = serializedNode;
    const node = createHashtagNode(category);
    return node;
  }

  exportJSON(): SerializedHashtagNode {
    return {
      ...super.exportJSON(),
      category: this.__category,
      type: 'hashtag',
      version: 1
    };
  }
}

export function createHashtagNode(category: SCCategoryType): HashtagNode {
  const hashtagNode = new HashtagNode(category);
  hashtagNode.setMode('segmented').toggleDirectionless();
  return hashtagNode;
}

export function isHashtagNode(node?: LexicalNode): boolean {
  return node.getType() === 'hashtag';
}
