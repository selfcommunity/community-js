import type { Meta, StoryObj } from '@storybook/react';
import CreateLivestreamButton from './index';

export default {
  title: 'Design System/React UI/CreateLivestreamButton',
  component: CreateLivestreamButton,
} as Meta<typeof CreateLivestreamButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateLivestreamButton {...args} />
  </div>
);

export const Base: StoryObj<typeof CreateLivestreamButton> = {
  args: {},
  render: template
};
