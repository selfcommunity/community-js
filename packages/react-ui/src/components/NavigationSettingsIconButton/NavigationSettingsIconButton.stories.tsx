import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NavigationSettingsIconButton, { NavigationSettingsIconButtonProps } from './index';

export default {
  title: 'Design System/React UI/Navigation Settings Icon Button',
  component: NavigationSettingsIconButton,
} as Meta<typeof NavigationSettingsIconButton>;


const template = (args: NavigationSettingsIconButtonProps) => (
  <div style={{width: '100%'}}>
    <NavigationSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<NavigationSettingsIconButtonProps> = {
  args: {
    items: [
      {label: 'test', href: 'javascript:;'},
      {label: 'test1', href: '/test1'}
    ]
  },
  render: template
};

