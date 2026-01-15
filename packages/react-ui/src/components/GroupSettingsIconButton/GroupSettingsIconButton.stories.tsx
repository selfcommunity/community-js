import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupSettingsIconButton, { GroupSettingsIconButtonProps } from './index';

export default {
  title: 'Design System/React UI/Group Settings Icon Button',
  component: GroupSettingsIconButton
} as Meta<typeof GroupSettingsIconButton>;

const template = (args: GroupSettingsIconButtonProps) => (
  <div style={{width: 400}}>
    <GroupSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupSettingsIconButton> = {
  render: template
};