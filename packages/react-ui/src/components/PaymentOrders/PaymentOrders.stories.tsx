import type { Meta, StoryObj } from '@storybook/react';
import PaymentOrders from './index';

export default {
	title: 'Design System/React UI/Payments/PaymentOrders',
	component: PaymentOrders,
} as Meta<typeof PaymentOrders>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentOrders {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentOrders> = {
	args: {},
	render: template
};


