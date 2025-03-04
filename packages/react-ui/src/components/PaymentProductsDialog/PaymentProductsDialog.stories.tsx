import type { Meta, StoryObj } from '@storybook/react';
import PaymentProductsDialog from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaymentProductsDialog',
	component: PaymentProductsDialog,
} as Meta<typeof PaymentProductsDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentProductsDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentProductsDialog> = {
	args: {
		PaymentProductPricesComponentProps: {
			id: 1,
			contentType: SCContentType.EVENT
		}
	},
	render: template
};


