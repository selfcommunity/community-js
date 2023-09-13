import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  KEY_ARROW_LEFT_COMMAND
} from 'lexical';
import * as React from 'react';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { getSelectedNode } from '../../../utils/editor';
import { isValidUrl } from '@selfcommunity/utils';
import { styled } from '@mui/material/styles';
import { IconButton, InputAdornment, Paper, Popper, TextField } from '@mui/material';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCEditorFloatingLinkPlugin';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

function FloatingLinkPlugin({editor, isLink, setIsLink}: {editor: LexicalEditor; isLink: boolean; setIsLink: Dispatch<boolean>}): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [hideForUrl, setHideForUrl] = useState<string | null>(null);
  const [lastSelection, setLastSelection] = useState<RangeSelection | GridSelection | NodeSelection | null>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      setAnchorEl(nativeSelection.focusNode?.parentElement);
      setLastSelection(selection);
    } else if (!activeElement) {
      setAnchorEl(null);
      setLastSelection(null);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    if (linkUrl != hideForUrl) {
      setHideForUrl(null);
    }
  }, [linkUrl]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        setHideForUrl(linkUrl);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, isValidUrl(linkUrl) ? linkUrl : 'https://');
      }
    }
  };

  if (!isLink || linkUrl === hideForUrl) {
    return null;
  }

  return (
    <Root className={classes.root} open={Boolean(anchorEl)} anchorEl={anchorEl} placement="right">
      <Paper>
          <TextField
            size="small"
            value={linkUrl}
            variant="outlined"
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <IconButton
                  size="small"
                  tabIndex={0}
                  onClick={() => {
                    setIsLink(false);
                  }}>
                  <Icon>close</Icon>
                </IconButton>
                <IconButton size="small" tabIndex={1} onClick={handleLinkSubmission}>
                  <Icon>check</Icon>
                </IconButton>
              </InputAdornment>
            }}
          />
      </Paper>
    </Root>
  );
}

function useFloatingLinkEditorToolbar(editor: LexicalEditor): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
      // We don't want this menu to open for auto links.
      if (linkParent != null && autoLinkParent == null) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  return <FloatingLinkPlugin editor={activeEditor} isLink={isLink} setIsLink={setIsLink} />;
}

export default (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor);
};
