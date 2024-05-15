import type { Meta, StoryObj } from '@storybook/react';
import GroupSettingsIconButton from './index';

export default {
  title: 'Design System/React UI/Group Settings Icon Button',
  component: GroupSettingsIconButton
} as Meta<typeof GroupSettingsIconButton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<GroupSettingsIconButton> = {
  render: template
};