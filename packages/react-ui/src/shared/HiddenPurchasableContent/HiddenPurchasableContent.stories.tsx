import type { Meta, StoryObj } from '@storybook/react';
import HiddenPurchasableContent from './index';

export default {
  title: 'Design System/React UI Shared/HiddenPurchasableContent',
  component: HiddenPurchasableContent
} as Meta<typeof HiddenPurchasableContent>;

const template = (args) => <HiddenPurchasableContent {...args} />;

export const Base: StoryObj<typeof HiddenPurchasableContent> = {
  args: {},
  render: template
};
