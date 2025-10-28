import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BaseItemButton, { BaseItemButtonProps } from './index';

export default {
  title: 'Design System/React UI Shared/BaseItemButton',
  component: BaseItemButton
} as Meta<typeof BaseItemButton>;

const template = (args:BaseItemButtonProps) => <BaseItemButton {...args} />;

export const Base: StoryObj<typeof BaseItemButton> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};