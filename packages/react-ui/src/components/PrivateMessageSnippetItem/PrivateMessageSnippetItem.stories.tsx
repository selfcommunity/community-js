import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageSnippetItem, { PrivateMessageSnippetItemProps } from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItem
} as Meta<typeof PrivateMessageSnippetItem>;

const template = (args: PrivateMessageSnippetItemProps) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItem {...args} />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageSnippetItem> = {
  render: template
};
