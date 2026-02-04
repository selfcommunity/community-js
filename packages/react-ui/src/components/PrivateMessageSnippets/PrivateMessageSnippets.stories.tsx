import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageSnippets, { PrivateMessageSnippetsProps } from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSnippets',
  component: PrivateMessageSnippets
} as Meta<typeof PrivateMessageSnippets>;

const template = (args: PrivateMessageSnippetsProps) => (
    <PrivateMessageSnippets {...args} />
);

export const Base: StoryObj<typeof PrivateMessageSnippets> = {
  render: template
};