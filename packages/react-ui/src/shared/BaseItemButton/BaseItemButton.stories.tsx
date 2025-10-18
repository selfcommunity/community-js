import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BaseItemButton from './index';
import BaseItem from '../BaseItem';

export default {
  title: 'Design System/React UI Shared/BaseItemButton',
  component: BaseItemButton
} as Meta<typeof BaseItemButton>;

const template = (args) => <BaseItemButton {...args} />;

export const Base: StoryObj<BaseItemButton> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};