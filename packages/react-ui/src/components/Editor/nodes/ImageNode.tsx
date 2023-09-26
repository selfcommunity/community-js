import React, {LegacyRef, Suspense, useCallback, useEffect, useRef} from 'react';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
  SerializedLexicalNode,
  Spread,
  TextNode
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';

import {mergeRegister} from '@lexical/utils';

export interface ImagePayload {
  altText: string;
  className?: string;
  height?: 'inherit' | number;
  imageRef?: LegacyRef<HTMLImageElement>;
  maxWidth: number | string;
  src: string;
  width?: 'inherit' | number;
}

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve();
      };
    });
  }
}

function LazyImage({altText, className, imageRef, src, width, height, maxWidth}: ImagePayload): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height: `${height}${height === 'inherit' ? '' : 'px'}`,
        maxWidth,
        width: `${width}${width === 'inherit' ? '' : 'px'}`
      }}
    />
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  maxWidth
}: {
  altText: string;
  maxWidth: string | number;
  nodeKey: NodeKey;
  src: string;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected]
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected]
  );

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );
    return () => {
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, onEnter, onEscape, setSelected]);

  return (
    <Suspense fallback={null}>
      <LazyImage
        className={isSelected ? `selected` : null}
        src={src}
        altText={altText}
        imageRef={imageRef}
        maxWidth={maxWidth}
      />
    </Suspense>
  );
}

function convertImageElement(domNode) {
  if (domNode instanceof HTMLImageElement) {
    const {alt: altText, src} = domNode;
    const node = $createImageNode({altText, src, maxWidth: '100%'});
    return {node};
  }
  return null;
}
export type SerializedImageNode = Spread<
  {
    altText: string;
    maxWidth: number | string;
    src: string;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __maxWidth: number | string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.__key);
  }

  constructor(src: string, altText: string, maxWidth: number | string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
  }

  setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void {
    const writable = this.getWritable();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    writable.__width = width;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    writable.__height = height;
  }
  // View

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const dom = TextNode.importDOM();
    return {
      img: (node) => ({
        conversion: convertImageElement,
        priority: 0
      }),
      ...dom
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('style', `max-width: ${this.__maxWidth}px;`);
    return {element};
  }

  decorate(): JSX.Element {
    return <ImageComponent src={this.__src} altText={this.__altText} maxWidth={this.__maxWidth} nodeKey={this.getKey()} />;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, maxWidth, src} = serializedNode;
    const node = $createImageNode({
      altText,
      src,
      maxWidth
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1
    };
  }
}

export function $createImageNode({src, altText, maxWidth}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth);
}

export function $isImageNode(node?: LexicalNode): boolean {
  return node.getType() === 'image';
}
