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
			checkoutSessionId: "cs_test_b1KxLQbiLjsQAm8OSwoJmFXBg6hiWNms1zDBoreTKPpnSmDqcLxgn4oSNg",
	},
	render: template
};


