import type { Meta, StoryObj } from '@storybook/react';
import EmojiPicker from './index';

export default {
  title: 'Design System/React UI Shared/EmojiPicker',
  component: EmojiPicker
} as Meta<typeof EmojiPicker>;

const template = (args) => <EmojiPicker {...args} />;

export const Base: StoryObj<EmojiPicker> = {
  render: template
};