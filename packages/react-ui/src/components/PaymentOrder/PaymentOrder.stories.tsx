import type { Meta, StoryObj } from '@storybook/react';
import PaymentOrder from './index';

export default {
	title: 'Design System/React UI/Payments/PaymentOrder',
	component: PaymentOrder,
} as Meta<typeof PaymentOrder>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentOrder {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentOrder> = {
	args: {
			paymentOrderId: 110
	},
	render: template
};


