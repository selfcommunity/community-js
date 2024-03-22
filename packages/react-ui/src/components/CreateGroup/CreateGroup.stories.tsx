import type { Meta, StoryObj } from '@storybook/react';
import CreateGroup, { CreateGroupProps } from './index';

export default {
  title: 'Design System/React UI/Create Group',
  component: CreateGroup,
} as Meta<typeof CreateGroup>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateGroup{...args} />
  </div>
);


export const Base: StoryObj<CreateGroupProps> = {
  args: {},
  render: template
};