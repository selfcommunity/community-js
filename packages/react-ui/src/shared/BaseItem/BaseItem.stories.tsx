import type { Meta, StoryObj } from '@storybook/react';
import BaseItem from './index';

export default {
  title: 'Design System/React UI Shared/BaseItem',
  component: BaseItem
} as Meta<typeof BaseItem>;

const template = (args) => <BaseItem {...args} />;

export const Base: StoryObj<BaseItem> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};
