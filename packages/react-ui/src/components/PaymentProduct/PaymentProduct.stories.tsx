import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaymentProducts, { PaymentProductProps } from './index';

export default {
	title: 'Design System/React UI/Payments/PaymentProduct',
	component: PaymentProducts,
} as Meta<typeof PaymentProducts>;

const template = (args: PaymentProductProps) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentProducts {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentProducts> = {
	args: {
			paymentProductId: 5
	},
	render: template
};


