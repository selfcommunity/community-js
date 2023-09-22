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
  width,
  height,
  maxWidth
}: {
  altText: string;
  height: 'inherit' | number;
  maxWidth: string | number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
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

  const isFocused = isSelected;
  return (
    <Suspense fallback={null}>
      <LazyImage
        className={isFocused ? `focused` : null}
        src={src}
        altText={altText}
        imageRef={imageRef}
        width={width}
        height={height}
        maxWidth={maxWidth}
      />
    </Suspense>
  );
}

function convertImageElement(domNode) {
  if (domNode instanceof HTMLImageElement) {
    const {
      alt: altText,
      src,
      dataset: {width, height}
    } = domNode;
    const node = $createImageNode({altText, height: Number(height), src, width: Number(width), maxWidth: '100%'});
    return {node};
  }
  return null;
}
export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number | string;
    src: string;
    width?: number;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number | string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText: string, maxWidth: number | string, width?: 'inherit' | number, height?: 'inherit' | number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'inherit';
    this.__maxWidth = maxWidth;
    this.__height = height || 'inherit';
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
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
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
    element.setAttribute('width', `${this.__width}`);
    element.setAttribute('height', `${this.__height}`);
    element.setAttribute('style', `max-width: ${this.__maxWidth}px;`);
    return {element};
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
      />
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, maxWidth, src} = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
      maxWidth
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width
    };
  }
}

export function $createImageNode({src, altText, maxWidth, width = null, height = null}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height);
}

export function $isImageNode(node?: LexicalNode): boolean {
  return node.getType() === 'image';
}
