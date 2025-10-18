import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BuyButton, { BuyButtonProps } from './index';

export default {
  title: 'Design System/React UI/BuyButton',
  component: BuyButton,
  args: {
    eventId: 113
  }
} as Meta<typeof BuyButton>;

const template = (args) => (
    <BuyButton {...args} />
);

export const Base: StoryObj<BuyButtonProps> = {
  args: {
    eventId: 113
  },
  render: template
};
