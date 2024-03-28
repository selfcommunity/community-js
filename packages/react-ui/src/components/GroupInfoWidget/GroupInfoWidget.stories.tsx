import type { Meta, StoryObj } from '@storybook/react';
import GroupInfoWidget from './index';

export default {
  title: 'Design System/React UI/Group Info Widget ',
  component: GroupInfoWidget
} as Meta<typeof GroupInfoWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupInfoWidget {...args} />
  </div>
);

export const Base: StoryObj<GroupInfoWidget> = {
  args: {
    groupId: 1
  },
  render: template
};