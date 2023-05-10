import React, {ChangeEvent, LegacyRef, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  DOMExportOutput,
  DRAGSTART_COMMAND,
  EditorConfig,
  GridSelection,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  SerializedLexicalNode,
  Spread,
  TextNode
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';

import {mergeRegister} from '@lexical/utils';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {Box, Button, InputAdornment, Paper, TextField} from '@mui/material';

const PREFIX = 'SCEditorImagePluginImageEdit';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 2000,
  outline: `2px solid ${theme.palette.primary.main}`,
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiPaper-root': {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    '& > *': {
      margin: theme.spacing(1)
    }
  }
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
  const [openResizePanel, setOpenResizePanel] = useState<boolean>(false);

  // HANDLERS
  const handleStopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
  const handleOpenResizePanel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenResizePanel(true);
    return false;
  };

  const handleChangeWidth = (event: ChangeEvent<HTMLInputElement>) => {
    setWidth(event.target.value);
  };

  const handleChangeHeight = (event: ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };

  const handleResize = (event) => {
    onResize(width, height);
    setOpenResizePanel(false);
  };

  // RENDER
  console.log(width);
  return (
    <Root
      className={classes.root}
      style={{width: imageRef.current.width, height: imageRef.current.height}}
      contentEditable={false}
      onClick={handleStopPropagation}>
      <Paper>
        {openResizePanel ? (
          <>
            <TextField
              value={width}
              type="number"
              onChange={handleChangeWidth}
              label={<FormattedMessage id="ui.editor.imagePluginEdit.width" defaultMessage="ui.editor.imagePluginEdit.width" />}
              InputProps={{
                endAdornment: <InputAdornment position="start">px</InputAdornment>
              }}
            />
            <TextField
              value={height}
              type="number"
              onChange={handleChangeHeight}
              label={<FormattedMessage id="ui.editor.imagePluginEdit.height" defaultMessage="ui.editor.imagePluginEdit.height" />}
              InputProps={{
                endAdornment: <InputAdornment position="start">px</InputAdornment>
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={width === imageRef.current.width && height === imageRef.current.height}
              onClick={handleResize}>
              <FormattedMessage id="ui.editor.imagePluginEdit.resize" defaultMessage="ui.editor.imagePluginEdit.resize" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleOpenResizePanel}>
              <FormattedMessage id="ui.editor.imagePluginEdit.resize" defaultMessage="ui.editor.imagePluginEdit.resize" />
            </Button>
            <Button variant="contained" color="secondary" onClick={onDelete}>
              <FormattedMessage id="ui.editor.imagePluginEdit.delete" defaultMessage="ui.editor.imagePluginEdit.delete" />
            </Button>
          </>
        )}
      </Paper>
    </Root>
  );
};

function clamp(value: number, min: number, max: number | string) {
  return Math.min(Math.max(value, min), Number(max));
}

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2
};

function ImageResizer({
  onResizeStart,
  onResizeEnd,
  imageRef,
  maxWidth,
  editor
}: {
  editor: LexicalEditor;
  imageRef: {current: null | HTMLElement};
  maxWidth?: number;
  onResizeEnd: (width: 'inherit' | number, height: 'inherit' | number) => void;
  onResizeStart: () => void;
}): JSX.Element {
  const controlWrapperRef = useRef<HTMLDivElement>(null);
  const userSelect = useRef({
    priority: '',
    value: 'default'
  });
  const positioningRef = useRef<{
    currentHeight: 'inherit' | number;
    currentWidth: 'inherit' | number;
    direction: number;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  }>({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0
  });
  const editorRootElement = editor.getRootElement();
  // Find max width, accounting for editor padding.
  const maxWidthContainer = maxWidth ? maxWidth : editorRootElement !== null ? editorRootElement.getBoundingClientRect().width - 20 : 100;
  const maxHeightContainer = editorRootElement !== null ? editorRootElement.getBoundingClientRect().height - 20 : 100;

  const minWidth = 100;
  const minHeight = 100;

  const setStartCursor = (direction: number) => {
    const ew = direction === Direction.east || direction === Direction.west;
    const ns = direction === Direction.north || direction === Direction.south;
    const nwse = (direction & Direction.north && direction & Direction.west) || (direction & Direction.south && direction & Direction.east);

    const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
      userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
      userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
      document.body.style.setProperty('-webkit-user-select', `none`, 'important');
    }
  };

  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', 'text');
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', 'default');
      document.body.style.setProperty('-webkit-user-select', userSelect.current.value, userSelect.current.priority);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, direction: number) => {
    if (!editor.isEditable()) {
      return;
    }

    const image = imageRef.current;
    const controlWrapper = controlWrapperRef.current;

    if (image !== null && controlWrapper !== null) {
      const {width, height} = image.getBoundingClientRect();
      const positioning = positioningRef.current;
      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = width / height;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX;
      positioning.startY = event.clientY;
      positioning.isResizing = true;
      positioning.direction = direction;

      setStartCursor(direction);
      onResizeStart();

      controlWrapper.classList.add('image-control-wrapper--resizing');
      image.style.height = `${height}px`;
      image.style.width = `${width}px`;

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };
  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;

    const isHorizontal = positioning.direction & (Direction.east | Direction.west);
    const isVertical = positioning.direction & (Direction.south | Direction.north);

    if (image !== null && positioning.isResizing) {
      // Corner cursor
      if (isHorizontal && isVertical) {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);

        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else if (isVertical) {
        let diff = Math.floor(positioning.startY - event.clientY);
        diff = positioning.direction & Direction.south ? -diff : diff;

        const height = clamp(positioning.startHeight + diff, minHeight, maxHeightContainer);

        image.style.height = `${height}px`;
        positioning.currentHeight = height;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);

        image.style.width = `${width}px`;
        positioning.currentWidth = width;
      }
    }
  };
  const handlePointerUp = () => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth;
      const height = positioning.currentHeight;
      positioning.startWidth = 0;
      positioning.startHeight = 0;
      positioning.ratio = 0;
      positioning.startX = 0;
      positioning.startY = 0;
      positioning.currentWidth = 0;
      positioning.currentHeight = 0;
      positioning.isResizing = false;

      controlWrapper.classList.remove('image-control-wrapper--resizing');

      setEndCursor();
      console.log(width);
      console.log(height);
      onResizeEnd(width, height);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    }
  };
  return (
    <div ref={controlWrapperRef}>
      <div
        className="image-resizer image-resizer-n"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north);
        }}
      />
      <div
        className="image-resizer image-resizer-ne"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-e"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-se"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-s"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south);
        }}
      />
      <div
        className="image-resizer image-resizer-sw"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.west);
        }}
      />
      <div
        className="image-resizer image-resizer-w"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.west);
        }}
      />
      <div
        className="image-resizer image-resizer-nw"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.west);
        }}
      />
    </div>
  );
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
  maxWidth,
  resizable
}: {
  altText: string;
  height: 'inherit' | number;
  maxWidth: string | number;
  nodeKey: NodeKey;
  resizable: boolean;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<RangeSelection | NodeSelection | GridSelection | null>(null);
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
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
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

          if (isResizing) {
            return true;
          }
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
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
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
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, onDelete, onEnter, onEscape, setSelected]);

  const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
  const isFocused = isSelected || isResizing;
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          <LazyImage
            className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
        </div>
        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={typeof maxWidth === 'number' ? maxWidth : null}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
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
    console.log(this.__maxWidth);
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
