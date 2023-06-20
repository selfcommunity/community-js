import type { Meta, StoryObj } from '@storybook/react';
import NavigationMenuIconButton from './index';

export default {
  title: 'Design System/React UI/Navigation Menu Icon Button',
  component: NavigationMenuIconButton,
} as Meta<typeof NavigationMenuIconButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <NavigationMenuIconButton {...args} />
  </div>
);

export const Base: StoryObj<NavigationMenuIconButton> = {
  render: template
};
