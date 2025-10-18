import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageSnippets from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSnippets',
  component: PrivateMessageSnippets
} as Meta<typeof PrivateMessageSnippets>;

const template = (args) => (
    <PrivateMessageSnippets {...args} />
);

export const Base: StoryObj<PrivateMessageSnippets> = {
  render: template
};