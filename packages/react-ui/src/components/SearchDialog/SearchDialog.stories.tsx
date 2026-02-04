import type { Meta, StoryObj } from '@storybook/react-webpack5';
import SearchDialog, { SearchDialogProps } from './index';

export default {
  title: 'Design System/React UI/Search Dialog',
  component: SearchDialog
} as Meta<typeof SearchDialog>;

const template = (args: SearchDialogProps) => (
  <div style={{width: 400}}>
    <SearchDialog {...args} />
  </div>
);

export const Base: StoryObj<typeof SearchDialog> = {
  args: {
    open: true
  },
  render: template
};