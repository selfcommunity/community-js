import React, {Suspense, useCallback, useEffect, useRef} from 'react';
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
  Spread
} from 'lexical';
import {documentPlaceholder} from '../../../utils/thumbnailCoverter';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {Box, Link, Typography} from '@mui/material';
import {mergeRegister} from '@lexical/utils';

export interface DocPayload {
  name: string;
  src: string;
  type: string;
  className?: string;
}

function DocComponent({src, name, nodeKey}: {src: string; name: string; nodeKey: NodeKey}): JSX.Element {
  const ref = useRef<null | HTMLDivElement>(null);
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
        if ($isDocNode(node)) {
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

          if (event.target === ref.current) {
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
      <Box ref={ref} className={isSelected ? `selected` : null}>
        <Link href={src} target="_blank" rel="noopener noreferrer" underline="none">
          <img src={documentPlaceholder} alt={name} />
          <Typography variant="body1" color={'text.primary'}>
            {name}
          </Typography>
        </Link>
      </Box>
    </Suspense>
  );
}

function convertDocElement(domNode: HTMLElement) {
  if (domNode instanceof HTMLDivElement && domNode.getAttribute('src')) {
    const src = domNode.getAttribute('src')!;
    const name = domNode.getAttribute('alt') || 'Untitled Document';
    return {node: $createDocNode({src, name, type: 'doc'})};
  }
  return null;
}
export type SerializedDocNode = Spread<
  {
    src: string;
    name: string;
    type: 'doc';
    version: 1;
  },
  SerializedLexicalNode
>;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export class DocNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __name: string;
  __type: string;

  static getType(): string {
    return 'doc';
  }

  static clone(node: DocNode): DocNode {
    return new DocNode(node.__src, node.__name, node.__type, node.__key);
  }

  constructor(src: string, name: string, type?: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__name = name;
    this.__type = type;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const theme = config.theme;
    const className = theme.document;
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM() {
    return {
      div: (node: HTMLElement) => {
        if (node.hasAttribute('src')) {
          return {
            conversion: convertDocElement,
            priority: 1
          };
        }
        return null;
      }
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__name);
    element.className = 'SCEditor-document';

    const link = document.createElement('a');
    link.href = this.__src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = this.__name;
    link.style.textDecoration = 'none';

    // Add an Image
    const img = document.createElement('img');
    img.src = documentPlaceholder;
    img.alt = this.__name;
    img.style.marginRight = '8px';

    // Add a Typography-like Text Node
    const text = document.createElement('span');
    text.textContent = this.__name;

    // Append elements
    link.append(img, text);
    element.appendChild(link);

    return {element};
  }

  decorate(): JSX.Element {
    return <DocComponent src={this.__src} name={this.__name} nodeKey={this.getKey()} />;
  }

  static importJSON(serializedNode: SerializedDocNode): DocNode {
    const {src, name, type} = serializedNode;
    const node = $createDocNode({
      src,
      name,
      type
    });
    return node;
  }

  exportJSON(): SerializedDocNode {
    return {
      src: this.__src,
      name: this.__name,
      type: 'doc',
      version: 1
    };
  }
}

export function $createDocNode({src, name, type}: DocPayload): DocNode {
  return new DocNode(src, name, type);
}

export function $isDocNode(node?: LexicalNode): boolean {
  return node.getType() === 'doc';
}
