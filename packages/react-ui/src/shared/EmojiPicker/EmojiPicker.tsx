import React from 'react';
import {Box, styled} from '@mui/material';
import {EmojiStyle, PickerProps} from 'emoji-picker-react';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {isClientSideRendering} from '@selfcommunity/utils';

let Picker: (props: PickerProps) => JSX.Element;
isClientSideRendering() &&
  import('emoji-picker-react').then((_module) => {
    Picker = _module.default;
  });

const PREFIX = 'SCEmojiPicker';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

interface EmojiPickerProps extends PickerProps {
  className?: string;
}

export default function EmojiPicker(inProps: EmojiPickerProps): JSX.Element {
  // PROPS
  const props: EmojiPickerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = '', emojiStyle = EmojiStyle.NATIVE, ...rest} = props;

  return <Root className={classNames(classes.root, className)}>{Picker && <Picker emojiStyle={emojiStyle} {...rest} />}</Root>;
}
