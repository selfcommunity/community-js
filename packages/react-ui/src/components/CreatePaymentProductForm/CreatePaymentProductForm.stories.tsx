import type { Meta, StoryObj } from '@storybook/react';
import PaymentProducts from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/CreatePaymentProductForm',
	component: PaymentProducts,
} as Meta<typeof PaymentProducts>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentProducts {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentProducts> = {
	args: {},
	render: template
};


