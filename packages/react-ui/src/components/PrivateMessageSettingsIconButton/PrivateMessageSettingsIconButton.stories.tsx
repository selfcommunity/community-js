import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageSettingsIconButton from './index';

export default {
  title: 'Design System/React UI/PrivateMessageSettingsIconButton',
  component: PrivateMessageSettingsIconButton
} as Meta<typeof PrivateMessageSettingsIconButton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageSettingsIconButton> = {
  render: template
};