import React, {SyntheticEvent, useState} from 'react';
import {CONTROLLED_TEXT_INSERTION_COMMAND, LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {Fade, Icon, IconButton, Popover} from '@mui/material';
import {styled} from '@mui/material/styles';
// import deps only if csr
let Picker;
typeof window !== 'undefined' &&
  import('emoji-picker-react').then((_module) => {
    Picker = _module.default;
  });

function Emoji({editor, className = ''}: {editor: LexicalEditor; className?: string}): JSX.Element {
  // STATE
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<any>(false);

  // HANDLERS
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
  };

  const handleEmojiClick = (event: SyntheticEvent, emoji) => {
    editor.focus();
    editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, emoji.emoji);
  };

  return (
    <>
      <IconButton className={className} onClick={handleClick} color="inherit">
        <Icon>sentiment_satisfied_alt</Icon>
      </IconButton>
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={() => setEmojiAnchorEl(null)}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={(theme) => {
          return {zIndex: theme.zIndex.tooltip};
        }}>
        {Picker && <Picker onEmojiClick={handleEmojiClick} />}
      </Popover>
    </>
  );
}

const PREFIX = 'SCEditorEmojiPlugin';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Emoji, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function EmojiPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return <Root editor={editor} className={classes.root} />;
}
