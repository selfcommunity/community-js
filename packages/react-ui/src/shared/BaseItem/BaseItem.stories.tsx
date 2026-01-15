import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BaseItem, { BaseItemProps } from './index';

export default {
  title: 'Design System/React UI Shared/BaseItem',
  component: BaseItem
} as Meta<typeof BaseItem>;

const template = (args: BaseItemProps) => <BaseItem {...args} />;

export const Base: StoryObj<typeof BaseItem> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};
