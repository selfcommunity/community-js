import type { Meta, StoryObj } from '@storybook/react';
import ContentObjectBuyButton, { ContentObjectBuyButtonProps } from './index';

export default {
  title: 'Design System/React UI/ContentObjectBuyButton',
  component: ContentObjectBuyButton,
  args: {
    eventId: 113
  }
} as Meta<typeof ContentObjectBuyButton>;

const template = (args) => (
    <ContentObjectBuyButton {...args} />
);

export const Base: StoryObj<ContentObjectBuyButtonProps> = {
  args: {
    eventId: 113
  },
  render: template
};
