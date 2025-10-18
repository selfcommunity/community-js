import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaymentOrderPdfButton, { PaymentOrderPdfButtonProps } from './index';

export default {
  title: 'Design System/React UI/Payments/PaymentOrderPdfButton',
  component: PaymentOrderPdfButton,
  args: {
		paymentOrderId: 114
  }
} as Meta<typeof PaymentOrderPdfButton>;

const template = (args) => (
    <PaymentOrderPdfButton {...args} />
);

export const Base: StoryObj<PaymentOrderPdfButtonProps> = {
  args: {
    paymentOrderId: 114
  },
  render: template
};
