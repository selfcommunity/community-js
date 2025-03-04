import type { Meta, StoryObj } from '@storybook/react';
import CheckoutSuccessDialog from './index';

export default {
	title: 'Design System/React UI/Payments/CheckoutSuccessDialog',
	component: CheckoutSuccessDialog,
} as Meta<typeof CheckoutSuccessDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<CheckoutSuccessDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof CheckoutSuccessDialog> = {
	args: {
			checkoutSessionId: "1",
	},
	render: template
};


