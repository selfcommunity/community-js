import type { Meta, StoryObj } from '@storybook/react';
import SearchDialog from './index';

export default {
  title: 'Design System/React UI/Search Dialog',
  component: SearchDialog
} as Meta<typeof SearchDialog>;

const template = (args) => (
  <div style={{width: 400}}>
    <SearchDialog {...args}></SearchDialog>
  </div>
);

export const Base: StoryObj<SearchDialog> = {
  args: {
    open: true
  },
  render: template
};