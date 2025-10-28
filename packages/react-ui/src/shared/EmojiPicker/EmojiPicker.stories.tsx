import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EmojiPicker from './index';
import { EmojiPickerProps } from './EmojiPicker';

export default {
  title: 'Design System/React UI Shared/EmojiPicker',
  component: EmojiPicker
} as Meta<typeof EmojiPicker>;

const template = (args: EmojiPickerProps) => <EmojiPicker {...args} />;

export const Base: StoryObj<typeof EmojiPicker> = {
  render: template
};