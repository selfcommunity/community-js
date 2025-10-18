import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaymentProducts from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaymentProduct',
	component: PaymentProducts,
} as Meta<typeof PaymentProducts>;

const template = (args) => (
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


