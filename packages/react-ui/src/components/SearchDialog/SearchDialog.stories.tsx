import type { Meta, StoryObj } from '@storybook/react';
import SearchDialog, { SearchDialogProps } from './index';

export default {
  title: 'Design System/React UI/Search Dialog',
  component: SearchDialog
} as Meta<SearchDialogProps>;

const template = (args) => (
  <div style={{width: 400}}>
    <SearchDialog {...args}></SearchDialog>
  </div>
);

export const Base: StoryObj<SearchDialogProps> = {
  args: {
    open: true
  },
  render: template
};