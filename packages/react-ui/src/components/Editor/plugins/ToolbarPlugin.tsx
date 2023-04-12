/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ElementFormatType, LexicalEditor, NodeKey, TextFormatType} from 'lexical';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';

import {$createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from '@lexical/list';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {$createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType} from '@lexical/rich-text';
import {$setBlocksType} from '@lexical/selection';
import {$isTableNode} from '@lexical/table';
import {$findMatchingParent, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType, mergeRegister} from '@lexical/utils';
import * as React from 'react';
import {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {getSelectedNode} from '../../../utils/editor';
import {Box, Icon, IconButton, MenuItem, ToggleButton, ToggleButtonGroup, Tooltip} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import TextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote'
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
};

const FORMATS: TextFormatType[] = ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'];
const ALIGNMENTS: ElementFormatType[] = ['left', 'right', 'center', 'justify'];

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  // FORMAT METHODS
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  // HANDLERS
  const handleChange = (event) => {
    switch (event.target.value) {
      case 'bullet':
        formatBulletList();
        break;
      case 'code':
        formatCode();
        break;
      case 'number':
        formatNumberedList();
        break;
      case 'paragraph':
        formatParagraph();
        break;
      case 'quote':
        formatQuote();
        break;
      default:
        formatHeading(event.target.value);
        break;
    }
  };

  return (
    <TextField
      disabled={disabled}
      select
      label={<FormattedMessage id="ui.editor.toolbarPlugin.blockType" defaultMessage="ui.editor.toolbarPlugin.blockType" />}
      value={blockType}
      size="small"
      onChange={handleChange}>
      {Object.keys(blockTypeToBlockName).map((block) => (
        <MenuItem key={block} value={block}>
          {blockTypeToBlockName[block]}
        </MenuItem>
      ))}
    </TextField>
  );
}

const PREFIX = 'SCEditorToolbarPlugin';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [formats, setFormats] = useState<TextFormatType[]>([]);
  const [alignments, setAlignments] = useState<ElementFormatType[]>([]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setFormats(FORMATS.filter((f: TextFormatType) => selection.hasFormat(f)));
      setAlignments(ALIGNMENTS.filter((a: ElementFormatType) => element.getFormatType() === a));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type as keyof typeof blockTypeToBlockName);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage();
            setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '');
            return;
          }
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              node = node.splitText(focus.offset)[0] || node;
            }

            if (node.__style !== '') {
              node.setStyle('');
            }
            if (node.__format !== 0) {
              node.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(node).setFormat('');
            }
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <Root className={classes.root}>
      <IconButton
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        aria-label="Undo">
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.undo" defaultMessage="ui.editor.toolbarPlugin.undo" />}>
          <Icon>undo</Icon>
        </Tooltip>
      </IconButton>
      <IconButton
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        aria-label="Redo">
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.redo" defaultMessage="ui.editor.toolbarPlugin.redo" />}>
          <Icon>redo</Icon>
        </Tooltip>
      </IconButton>
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <BlockFormatDropDown disabled={!isEditable} blockType={blockType} rootType={rootType} editor={editor} />
      )}
      {blockType === 'code' ? (
        <TextField
          disabled={!isEditable}
          size="small"
          select
          label={<FormattedMessage id="ui.editor.toolbarPlugin.codeLanguage" defaultMessage="ui.editor.toolbarPlugin.codeLanguage" />}
          value={codeLanguage}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onCodeLanguageSelect(event.target.value)}>
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return (
              <MenuItem key={value} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </TextField>
      ) : (
        <>
          <ToggleButtonGroup value={formats}>
            {FORMATS.map((format) => (
              <ToggleButton
                key={format}
                value={format}
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
                }}>
                <Tooltip title={<FormattedMessage id={`ui.editor.toolbarPlugin.${format}`} defaultMessage={`ui.editor.toolbarPlugin.${format}`} />}>
                  <Icon>format_{format}</Icon>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <IconButton disabled={!isEditable} onClick={insertLink}>
            <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.link" defaultMessage="ui.editor.toolbarPlugin.link" />}>
              <Icon>format_link</Icon>
            </Tooltip>
          </IconButton>
          <IconButton disabled={!isEditable} onClick={clearFormatting}>
            <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.clear" defaultMessage="ui.editor.toolbarPlugin.clear" />}>
              <Icon>format_clear</Icon>
            </Tooltip>
          </IconButton>
          <ToggleButtonGroup value={alignments}>
            {ALIGNMENTS.map((align: ElementFormatType) => (
              <ToggleButton
                key={align}
                value={align}
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
                }}>
                <Tooltip title={<FormattedMessage id={`ui.editor.toolbarPlugin.${align}`} defaultMessage={`ui.editor.toolbarPlugin.${align}`} />}>
                  <Icon>format_align_{align}</Icon>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}
    </Root>
  );
}
