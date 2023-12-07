import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageSnippetItem from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItem
} as Meta<typeof PrivateMessageSnippetItem>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItem {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageSnippetItem> = {
  render: template
};
