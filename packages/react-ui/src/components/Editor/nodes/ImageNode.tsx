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
  height: number;
  imageRef?: LegacyRef<HTMLImageElement>;
  src: string;
  width: number;
}

/**
 * Limit the width of an image
 * Used to compute the padding-bottom of the div that wrap the img
 */
const IMAGE_WIDTH_THRESHOLD = 500;

/**
 * Calc aspect-ratio of image
 * @param width
 * @param height
 */
function getAspectRatio(width: number, height: number): number {
  return width / height;
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

function LazyImage({altText, className, imageRef, src, width, height}: ImagePayload): JSX.Element {
  useSuspenseImage(src);
  const aspectRatio = getAspectRatio(IMAGE_WIDTH_THRESHOLD, height);
  return (
    <div draggable={false} className={className} style={{position: 'relative', paddingBottom: `${100 / aspectRatio}%`}}>
      <img
        src={src}
        alt={altText}
        ref={imageRef}
        style={{
          position: 'absolute',
          height: `100%`,
          width: `100%`
        }}
      />
    </div>
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height
}: {
  altText: string;
  height: number;
  nodeKey: NodeKey;
  src: string;
  width: number;
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
      <LazyImage className={isFocused ? `focused` : null} src={src} altText={altText} imageRef={imageRef} width={width} height={height} />
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
    const node = $createImageNode({altText, height: Number(height), src, width: Number(width)});
    return {node};
  }
  return null;
}
export type SerializedImageNode = Spread<
  {
    altText: string;
    height: number;
    src: string;
    width: number;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number;
  __height: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText: string, width: number, height: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
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
    const aspectRatio = getAspectRatio(this.__width, this.__height);
    const element = document.createElement('div');
    element.setAttribute('style', `position: relative;padding-bottom:${100 / aspectRatio}%`);
    const image = document.createElement('img');
    image.setAttribute('src', this.__src);
    image.setAttribute('alt', this.__altText);
    image.setAttribute('style', `position: absolute;width:100%;height:100%;`);
    image.setAttribute('data-width', `${this.__width}`);
    image.setAttribute('data-height', `${this.__height}`);
    element.appendChild(image);
    return {element};
  }

  decorate(): JSX.Element {
    return <ImageComponent src={this.__src} altText={this.__altText} width={this.__width} height={this.__height} nodeKey={this.getKey()} />;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, src} = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      src,
      width
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width
    };
  }
}

export function $createImageNode({src, altText, width, height}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node?: LexicalNode): boolean {
  return node.getType() === 'image';
}
