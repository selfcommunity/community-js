import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupInfoWidget, { GroupInfoWidgetProps } from './index';

export default {
  title: 'Design System/React UI/Group Info Widget ',
  component: GroupInfoWidget
} as Meta<typeof GroupInfoWidget>;

const template = (args: GroupInfoWidgetProps) => (
  <div style={{width: 400}}>
    <GroupInfoWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupInfoWidget> = {
  args: {
    groupId: 58
  },
  render: template
};