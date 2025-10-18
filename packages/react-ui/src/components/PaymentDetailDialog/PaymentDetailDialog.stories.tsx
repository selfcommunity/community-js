import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaymentDetailDialog from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaymentDetailDialog',
	component: PaymentDetailDialog,
} as Meta<typeof PaymentDetailDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaymentDetailDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof PaymentDetailDialog> = {
	args: {},
	render: template
};


