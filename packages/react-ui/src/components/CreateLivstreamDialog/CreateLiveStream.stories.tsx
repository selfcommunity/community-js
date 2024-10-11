import type { Meta, StoryObj } from '@storybook/react';
import CreateLivestreamDialog from './index';

export default {
  title: 'Design System/React UI/CreateLivestreamDialog ',
  component: CreateLivestreamDialog,
} as Meta<typeof CreateLivestreamDialog>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateLivestreamDialog{...args} />
  </div>
);


export const Base: StoryObj<typeof CreateLivestreamDialog> = {
  args: {},
  render: template
};
