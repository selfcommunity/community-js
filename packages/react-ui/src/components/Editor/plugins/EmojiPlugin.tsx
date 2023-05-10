import React, {useState} from 'react';
import {CONTROLLED_TEXT_INSERTION_COMMAND, LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {Drawer, Fade, Icon, IconButton, Popover, SwipeableDrawer, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCThemeType} from '@selfcommunity/react-core';
import {EmojiClickData} from 'emoji-picker-react';
import EmojiPicker from '../../../shared/EmojiPicker';

function Emoji({editor, className = ''}: {editor: LexicalEditor; className?: string}): JSX.Element {
  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<any>(false);

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    editor.focus();
    editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, emojiData.emoji);
  };

  if (isMobile) {
    return null;
  }

  return (
    <>
      <IconButton className={className} onClick={handleOpen}>
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
        <EmojiPicker onEmojiClick={handleEmojiClick} />
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
