import type { Meta, StoryObj } from '@storybook/react';
import PaymentInvoices from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaymentInvoices',
	component: PaymentInvoices,
} as Meta<typeof PaymentInvoices>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentInvoices {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentInvoices> = {
	args: {},
	render: template
};


