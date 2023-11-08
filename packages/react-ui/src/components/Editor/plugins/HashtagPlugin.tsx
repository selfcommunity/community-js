import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from '@selfcommunity/react-core';
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
import {createHashtagNode, HashtagNode} from '../nodes/HashtagNode';
import {CategoryService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCategoryType} from '@selfcommunity/types';
import classNames from 'classnames';
import {styled} from '@mui/material/styles';
import {PREFIX} from '../constants';

type HashtagMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

type Resolution = {
  match: HashtagMatch;
  range: Range;
};

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentHashtagsRegex = {
  NAME,
  PUNCTUATION
};

const CapitalizedNameHashtagsRegex = new RegExp('(^|[^#])((?:' + DocumentHashtagsRegex.NAME + '{' + 1 + ',})$)');

const PUNC = DocumentHashtagsRegex.PUNCTUATION;

const TRIGGERS = ['#', '\\uff20'].join('');

// Chars we expect to see in a hashtag (non-space, non-punctuation).
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

const HashSignHashtagsRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' + ')$'
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const HashSignHashtagsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const hashtagsCache = new Map();

function useHashtagLookupService(hashtagString) {
  const [results, setResults] = useState<Array<SCCategoryType> | null>(null);

  useEffect(() => {
    const cachedResults = hashtagsCache.get(hashtagString);

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    hashtagsCache.set(hashtagString, null);
    CategoryService.searchCategory({search: hashtagString, limit: 5, active: true}).then((res: SCPaginatedResponse<SCCategoryType>) => {
      hashtagsCache.set(hashtagString, res.results);
      setResults(res.results);
    });
  }, [hashtagString]);

  return results;
}

function HashtagsTypeaheadItem({
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
  result: SCCategoryType;
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
      {result.name}
    </li>
  );
}

function HashtagsTypeahead({
  close,
  editor,
  resolution,
  className = '',
  containerEl = null
}: {
  close: () => void;
  editor: LexicalEditor;
  resolution: Resolution;
  className?: string;
  containerEl?: any;
}): JSX.Element {
  const divRef = useRef(null);
  const match = resolution.match;
  const results = useHashtagLookupService(match.matchingString);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const div = divRef.current;
    const rootElement = editor.getRootElement();
    const parentContainerElement = containerEl ? containerEl : rootElement.parentElement;
    if (results !== null && div !== null && rootElement !== null) {
      const range = resolution.range;

      // Re-calc, relative to the parent container, prevent scroll problems
      const parentRootPos = parentContainerElement.getBoundingClientRect();
      const {left, right, top, height} = range.getBoundingClientRect();
      let relativePosTop = top - parentRootPos.top;
      let relativePosLeft = right - parentRootPos.left;
      div.style.position = 'absolute';
      div.style.top = `${relativePosTop + height + 7}px`;
      div.style.left = `${relativePosLeft - 14}px`;
      div.style.display = 'block';
      rootElement.setAttribute('aria-controls', 'hashtags-typeahead');

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

      createHashtagNodeFromSearchResult(editor, selectedEntry, match);
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

  useIsomorphicLayoutEffect(() => {
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
    <div className={className} aria-label="Suggested hashtags" ref={divRef} role="listbox">
      <ul>
        {results.slice(0, SUGGESTION_LIST_LENGTH_LIMIT).map((result, i) => (
          <HashtagsTypeaheadItem
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

function checkForCapitalizedNameHashtags(text, minMatchLength): HashtagMatch | null {
  const match = CapitalizedNameHashtagsRegex.exec(text);
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

function checkForHashSignHashtags(text, minMatchLength): HashtagMatch | null {
  let match = HashSignHashtagsRegex.exec(text);

  if (match === null) {
    match = HashSignHashtagsRegexAliasRegex.exec(text);
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

function getPossibleHashtagMatch(text): HashtagMatch | null {
  const match = checkForHashSignHashtags(text, 1);
  return match === null ? checkForCapitalizedNameHashtags(text, 3) : match;
}

function getTextUpToAnchor(selection: RangeSelection): string | null {
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  const anchorNode = anchor.getNode();
  // We should not be attempting to extract hashtags out of nodes
  // that are already being used for other core things. This is
  // especially true for immutable nodes, which can't be mutated at all.
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  const anchorOffset = anchor.offset;
  return anchorNode.getTextContent().slice(0, anchorOffset);
}

function tryToPositionRange(match: HashtagMatch, range: Range): boolean {
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

function getHashtagsTextToSearch(editor: LexicalEditor): string | null {
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
function getHashtagOffset(documentText: string, entryText: string, offset: number): number {
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
 * render a newly created HashtagNode.
 */
function createHashtagNodeFromSearchResult(editor: LexicalEditor, category: SCCategoryType, match: HashtagMatch): void {
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
    // We should not be attempting to extract hashtags out of nodes
    // that are already being used for other core things. This is
    // especially true for immutable nodes, which can't be mutated at all.
    if (!anchorNode.isSimpleText()) {
      return;
    }
    const selectionOffset = anchor.offset;
    const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
    const characterOffset = match.replaceableString.length;

    // Given a known offset for the hashtag match, look backward in the
    // text to see if there's a longer match to replace.
    const hashtagOffset = getHashtagOffset(textContent, category.name, characterOffset);
    const startOffset = selectionOffset - hashtagOffset;
    if (startOffset < 0) {
      return;
    }

    let nodeToReplace;
    if (startOffset === 0) {
      [nodeToReplace] = anchorNode.splitText(selectionOffset);
    } else {
      [, nodeToReplace] = anchorNode.splitText(startOffset, selectionOffset);
    }

    const hashtagNode = createHashtagNode(category);
    nodeToReplace.replace(hashtagNode);
    hashtagNode.select();
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

const classes = {
  root: `${PREFIX}-hashtag-plugin-root`
};

const Root = styled(HashtagsTypeahead, {
  name: PREFIX,
  slot: 'HashtagPluginRoot'
})(() => ({}));

function useHashtags(editor: LexicalEditor, containerSelector = null): JSX.Element {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  useEffect(() => {
    if (!editor.hasNodes([HashtagNode])) {
      throw new Error('HashtagsPlugin: HashtagNode not registered on editor');
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
      const text = getHashtagsTextToSearch(editor);

      if (text === previousText || range === null) {
        return;
      }
      previousText = text;

      if (text === null) {
        return;
      }
      const match = getPossibleHashtagMatch(text);
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

  if (resolution === null || editor === null) {
    return null;
  }

  // Set portal container
  const portalContainer = containerSelector
    ? editor.getRootElement().parentElement.closest(containerSelector)
    : editor.getRootElement().parentElement;

  return createPortal(
    <Root close={closeTypeahead} resolution={resolution} editor={editor} className={classes.root} containerEl={portalContainer} />,
    portalContainer
  );
}

export default function HashtagsPlugin({containerSelector = 'body'}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return useHashtags(editor, containerSelector);
}
