import type { Meta, StoryObj } from '@storybook/react';
import ContentObjectCheckout from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/ContentObjectCheckout',
	component: ContentObjectCheckout,
} as Meta<typeof ContentObjectCheckout>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<ContentObjectCheckout {...args} />
	</div>
);

export const Base: StoryObj<typeof ContentObjectCheckout> = {
	args: {
			contentId: 1,
			contentType: SCContentType.EVENT,
			priceId: ''
	},
	render: template
};


