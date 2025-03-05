import type { Meta, StoryObj } from '@storybook/react';
import CheckoutReturnDialog from './index';

export default {
	title: 'Design System/React UI/Payments/CheckoutReturnDialog',
	component: CheckoutReturnDialog,
} as Meta<typeof CheckoutReturnDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<CheckoutReturnDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof CheckoutReturnDialog> = {
	args: {
			checkoutSessionId: "cs_test_a1JkzmO5h0ExxYh2yL3Je1AO2iMJceJVJTGxVNiPefMWfUD3hz0TknTucl",
	},
	render: template
};


