import React, {ChangeEvent, LegacyRef, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  EditorConfig,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  TextNode
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';

import {mergeRegister} from '@lexical/utils';
import {createPortal} from 'react-dom';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {Icon, IconButton, InputAdornment, Stack, TextField} from '@mui/material';

const PREFIX = 'SCEditorImagePluginResizer';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'fixed',
  zIndex: 100,
  paddingTop: theme.spacing(),
  backgroundColor: theme.palette.background.paper,
  minWidth: 200,
  paddingBottom: theme.spacing()
}));

export interface ImagePayload {
  altText: string;
  className?: string;
  height?: 'inherit' | number;
  imageRef?: LegacyRef<HTMLImageElement>;
  maxWidth: number | string;
  src: string;
  width?: 'inherit' | number;
}

const ImageEdit = ({
  onResize,
  onDelete,
  imageRef
}: {
  imageRef: any;
  onResize: (width: number | 'inherit', height: number | 'inherit') => void;
  onDelete: () => void;
}): JSX.Element => {
  // STATE
  const [width, setWidth] = useState(imageRef.current.width);
  const [height, setHeight] = useState(imageRef.current.height);
  const [positioning, setPositioning] = useState(imageRef.current.getBoundingClientRect());

  // EFFECT
  useEffect(() => {
    if (width !== imageRef.current.width || height !== imageRef.current.height) {
      onResize(width, height);
    }
  }, [width, height]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // HANDLERS
  const handleScroll = () => {
    setPositioning(imageRef.current.getBoundingClientRect());
  };

  const handleChangeWidth = (event: ChangeEvent<HTMLInputElement>) => {
    setWidth(event.target.value);
  };

  const handleChangeHeight = (event: ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };

  // RENDER
  return (
    <Root className={classes.root} direction="row" sx={{top: positioning.top, left: positioning.left, width: positioning.width}} spacing={1}>
      <TextField
        value={width}
        size="small"
        type="number"
        onChange={handleChangeWidth}
        label={<FormattedMessage id="ui.editor.imagePluginResizer.width" defaultMessage="ui.editor.imagePluginResizer.width" />}
        InputProps={{
          endAdornment: <InputAdornment position="start">px</InputAdornment>
        }}
      />
      <TextField
        value={height}
        size="small"
        type="number"
        onChange={handleChangeHeight}
        label={<FormattedMessage id="ui.editor.imagePluginResizer.height" defaultMessage="ui.editor.imagePluginResizer.height" />}
        InputProps={{
          endAdornment: <InputAdornment position="start">px</InputAdornment>
        }}
      />
      <IconButton onClick={onDelete} size="small">
        <Icon>close</Icon>
      </IconButton>
    </Root>
  );
};

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
  maxWidth,
  resizable
}: {
  altText: string;
  height: 'inherit' | number;
  maxWidth: number | string;
  nodeKey: NodeKey;
  resizable: boolean;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);

  const onDelete = useCallback(() => {
    if (isSelected) {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
        setSelected(false);
      });
    }
    return false;
  }, [editor, isSelected, nodeKey, setSelected]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload: MouseEvent) => {
          const event = payload;

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  const onResize = (nextWidth, nextHeight) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  return (
    <Suspense fallback={null}>
      <>
        <LazyImage
          className={isSelected ? 'focused' : null}
          src={src}
          altText={altText}
          imageRef={ref}
          width={width}
          height={height}
          maxWidth={maxWidth}
        />
        {resizable &&
          $isNodeSelection(selection) &&
          isSelected &&
          createPortal(<ImageEdit imageRef={ref} onResize={onResize} onDelete={onDelete} />, document.body)}
      </>
    </Suspense>
  );
}

function convertImageElement(domNode) {
  const image = domNode;
  return {
    node: $createImageNode({src: image.getAttribute('src') as string, altText: image.getAttribute('alt'), maxWidth: '100%'})
  };
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
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
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

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        resizable={true}
      />
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, maxWidth, src} = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width
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
