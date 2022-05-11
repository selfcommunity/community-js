import React, {useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition} from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  LexicalEditor,
  RangeSelection
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {createPortal} from 'react-dom';

import {createMentionNode, MentionNode} from '../nodes/MentionNode';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserType} from '@selfcommunity/types';
import classNames from 'classnames';
import {Avatar} from '@mui/material';
import {styled} from '@mui/material/styles';

type MentionMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

type Resolution = {
  match: MentionMatch;
  range: Range;
};

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
};

const CapitalizedNameMentionsRegex = new RegExp('(^|[^#])((?:' + DocumentMentionsRegex.NAME + '{' + 1 + ',})$)');

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@', '\\uff20'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' + ')$'
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();

function useMentionLookupService(mentionString) {
  const [results, setResults] = useState<Array<SCUserType> | null>(null);

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    http
      .request({
        url: Endpoints.UserSearch.url(),
        method: Endpoints.UserSearch.method,
        params: {user: mentionString, limit: 7}
      })
      .then((res: HttpResponse<any>) => {
        mentionsCache.set(mentionString, res.data.results);
        setResults(res.data.results);
      });
  }, [mentionString]);

  return results;
}

function MentionsTypeaheadItem({
  index,
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  result
}: {
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  result: SCUserType;
}) {
  const liRef = useRef(null);
  return (
    <li
      key={result.id}
      tabIndex={-1}
      className={classNames('item', {['selected']: isSelected, ['hovered']: isHovered})}
      ref={liRef}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}>
      <Avatar alt={result.username} src={result.avatar} /> {result.username}
    </li>
  );
}

function MentionsTypeahead({
  close,
  editor,
  resolution,
  className = ''
}: {
  close: () => void;
  editor: LexicalEditor;
  resolution: Resolution;
  className?: string;
}): JSX.Element {
  const divRef = useRef(null);
  const match = resolution.match;
  const results = useMentionLookupService(match.matchingString);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const div = divRef.current;
    const rootElement = editor.getRootElement();
    if (results !== null && div !== null && rootElement !== null) {
      const range = resolution.range;
      const {left, top, height} = range.getBoundingClientRect();
      div.style.top = `${top + height + 2}px`;
      div.style.left = `${left - 14}px`;
      div.style.display = 'block';
      rootElement.setAttribute('aria-controls', 'mentions-typeahead');

      return () => {
        div.style.display = 'none';
        rootElement.removeAttribute('aria-controls');
      };
    }
  }, [editor, resolution, results]);

  const applyCurrentSelected = useCallback(
    (index?: number) => {
      index = index || selectedIndex;
      if (results === null || index === null) {
        return;
      }
      const selectedEntry = results[index];

      close();

      createMentionNodeFromSearchResult(editor, selectedEntry, match);
    },
    [close, match, editor, results, selectedIndex]
  );

  const updateSelectedIndex = useCallback(
    (index) => {
      const rootElem = editor.getRootElement();
      if (rootElem !== null) {
        rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index);
        setSelectedIndex(index);
      }
    },
    [editor]
  );

  useEffect(() => {
    return () => {
      const rootElem = editor.getRootElement();
      if (rootElem !== null) {
        rootElem.removeAttribute('aria-activedescendant');
      }
    };
  }, [editor]);

  useLayoutEffect(() => {
    if (results === null) {
      setSelectedIndex(null);
    } else if (selectedIndex === null) {
      updateSelectedIndex(0);
    }
  }, [results, selectedIndex, updateSelectedIndex]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        (payload: KeyboardEvent) => {
          const event: KeyboardEvent = payload;
          if (results !== null && selectedIndex !== null) {
            if (selectedIndex < SUGGESTION_LIST_LENGTH_LIMIT - 1 && selectedIndex !== results.length - 1) {
              updateSelectedIndex(selectedIndex + 1);
            }
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        (payload: KeyboardEvent) => {
          const event: KeyboardEvent = payload;
          if (results !== null && selectedIndex !== null) {
            if (selectedIndex !== 0) {
              updateSelectedIndex(selectedIndex - 1);
            }
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        (payload: KeyboardEvent) => {
          const event: KeyboardEvent = payload;
          if (results === null || selectedIndex === null) {
            return false;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          close();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (payload: KeyboardEvent) => {
          const event: KeyboardEvent = payload;
          if (results === null || selectedIndex === null) {
            return false;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          applyCurrentSelected();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          if (results === null || selectedIndex === null) {
            return false;
          }
          if (event !== null) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          applyCurrentSelected();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [applyCurrentSelected, close, editor, results, selectedIndex, updateSelectedIndex]);

  if (results === null) {
    return null;
  }

  return (
    <div className={className} aria-label="Suggested mentions" ref={divRef} role="listbox">
      <ul>
        {results.slice(0, SUGGESTION_LIST_LENGTH_LIMIT).map((result, i) => (
          <MentionsTypeaheadItem
            index={i}
            isHovered={i === hoveredIndex}
            isSelected={i === selectedIndex}
            onClick={() => {
              applyCurrentSelected(i);
            }}
            onMouseEnter={() => {
              setHoveredIndex(i);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
            }}
            key={result.id}
            result={result}
          />
        ))}
      </ul>
    </div>
  );
}

function checkForCapitalizedNameMentions(text, minMatchLength): MentionMatch | null {
  const match = CapitalizedNameMentionsRegex.exec(text);
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString
      };
    }
  }
  return null;
}

function checkForAtSignMentions(text, minMatchLength): MentionMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2]
      };
    }
  }
  return null;
}

function getPossibleMentionMatch(text): MentionMatch | null {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

function getTextUpToAnchor(selection: RangeSelection): string | null {
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  const anchorNode = anchor.getNode();
  // We should not be attempting to extract mentions out of nodes
  // that are already being used for other core things. This is
  // especially true for immutable nodes, which can't be mutated at all.
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  const anchorOffset = anchor.offset;
  return anchorNode.getTextContent().slice(0, anchorOffset);
}

function tryToPositionRange(match: MentionMatch, range: Range): boolean {
  const domSelection = window.getSelection();
  if (domSelection === null || !domSelection.isCollapsed) {
    return false;
  }
  const anchorNode = domSelection.anchorNode;
  const startOffset = match.leadOffset;
  const endOffset = domSelection.anchorOffset;
  try {
    range.setStart(anchorNode, startOffset);
    range.setEnd(anchorNode, endOffset);
  } catch (error) {
    return false;
  }

  return true;
}

function getMentionsTextToSearch(editor: LexicalEditor): string | null {
  let text = null;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    text = getTextUpToAnchor(selection);
  });
  return text;
}

/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 *
 * E.g. User types "Hello Sarah Smit" and we match "Smit" to "Sarah Smith".
 * Replacing just the match would give us "Hello Sarah Sarah Smith".
 * Instead we find the string "Sarah Smit" and replace all of it.
 */
function getMentionOffset(documentText: string, entryText: string, offset: number): number {
  let triggerOffset = offset;
  for (let ii = triggerOffset; ii <= entryText.length; ii++) {
    if (documentText.substr(-ii) === entryText.substr(0, ii)) {
      triggerOffset = ii;
    }
  }

  return triggerOffset;
}

/**
 * From a Typeahead Search Result, replace plain text from search offset and
 * render a newly created MentionNode.
 */
function createMentionNodeFromSearchResult(editor: LexicalEditor, user: SCUserType, match: MentionMatch): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
      return;
    }
    const anchor = selection.anchor;
    if (anchor.type !== 'text') {
      return;
    }
    const anchorNode = anchor.getNode();
    // We should not be attempting to extract mentions out of nodes
    // that are already being used for other core things. This is
    // especially true for immutable nodes, which can't be mutated at all.
    if (!anchorNode.isSimpleText()) {
      return;
    }
    const selectionOffset = anchor.offset;
    const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
    const characterOffset = match.replaceableString.length;

    // Given a known offset for the mention match, look backward in the
    // text to see if there's a longer match to replace.
    const mentionOffset = getMentionOffset(textContent, user.username, characterOffset);
    const startOffset = selectionOffset - mentionOffset;
    if (startOffset < 0) {
      return;
    }

    let nodeToReplace;
    if (startOffset === 0) {
      [nodeToReplace] = anchorNode.splitText(selectionOffset);
    } else {
      [, nodeToReplace] = anchorNode.splitText(startOffset, selectionOffset);
    }

    const mentionNode = createMentionNode(user);
    nodeToReplace.replace(mentionNode);
    mentionNode.select();
  });
}

function isSelectionOnEntityBoundary(editor: LexicalEditor, offset: number): boolean {
  if (offset !== 0) {
    return false;
  }
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const prevSibling = anchorNode.getPreviousSibling();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return $isTextNode(prevSibling) && prevSibling.isTextEntity();
    }
    return false;
  });
}

const PREFIX = 'SCEditorMentionPlugin';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(MentionsTypeahead, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'fixed',
  background: '#fff',
  boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
  borderEadius: 8,
  zIndex: 3000,
  '& ul': {
    padding: 0,
    listStyle: 'none',
    margin: 0,
    borderRadius: 10,
    '& li': {
      padding: theme.spacing(1),
      margin: 0,
      minWidth: 180,
      fontSize: theme.typography.body2.fontSize,
      outline: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
      alignItems: 'center',
      '&.selected': {
        background: theme.palette.action.selected
      },
      '&.hovered': {
        background: theme.palette.action.hover
      },
      '& .MuiAvatar-root': {
        width: 20,
        height: 20,
        marginRight: theme.spacing()
      }
    }
  }
}));

function useMentions(editor: LexicalEditor): JSX.Element {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  useEffect(() => {
    if (!editor.hasNodes([MentionNode])) {
      throw new Error('MentionsPlugin: MentionNode not registered on editor');
    }
  }, [editor]);

  useEffect(() => {
    let activeRange: Range | null = document.createRange();
    let previousText = null;

    const updateListener = ({prevEditorState}) => {
      if (prevEditorState.isEmpty()) {
        return;
      }
      const range = activeRange;
      const text = getMentionsTextToSearch(editor);

      if (text === previousText || range === null) {
        return;
      }
      previousText = text;

      if (text === null) {
        return;
      }
      const match = getPossibleMentionMatch(text);
      if (match !== null && !isSelectionOnEntityBoundary(editor, match.leadOffset)) {
        const isRangePositioned = tryToPositionRange(match, range);
        if (isRangePositioned !== null) {
          setResolution({
            match,
            range
          });
          return;
        }
      }
      setResolution(null);
    };

    const removeUpdateListener = editor.registerUpdateListener(updateListener);

    return () => {
      activeRange = null;
      removeUpdateListener();
    };
  }, [editor]);

  const closeTypeahead = useCallback(() => {
    setResolution(null);
  }, []);

  return resolution === null || editor === null
    ? null
    : createPortal(<Root close={closeTypeahead} resolution={resolution} editor={editor} className={classes.root} />, document.body);
}

export default function MentionsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return useMentions(editor);
}
