import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaymentProducts, { CreatePaymentProductFormProps } from './index';

export default {
	title: 'Design System/React UI/Payments/CreatePaymentProductForm',
	component: PaymentProducts,
} as Meta<typeof PaymentProducts>;

const template = (args: CreatePaymentProductFormProps) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentProducts {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentProducts> = {
	args: {},
	render: template
};


