import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageSettingsIconButton, { PrivateMessageSettingsIconButtonProps } from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSettingsIconButton',
  component: PrivateMessageSettingsIconButton
} as Meta<typeof PrivateMessageSettingsIconButton>;

const template = (args: PrivateMessageSettingsIconButtonProps) => (
  <div style={{width: 400}}>
    <PrivateMessageSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageSettingsIconButton> = {
  render: template
};