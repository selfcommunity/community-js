import type { Meta, StoryObj } from '@storybook/react';
import NavigationSettingsIconButton from './index';

export default {
  title: 'Design System/React UI/Navigation Settings Icon Button',
  component: NavigationSettingsIconButton,
} as Meta<typeof NavigationSettingsIconButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <NavigationSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<NavigationSettingsIconButton> = {
  render: template
};

