import type { Meta, StoryObj } from '@storybook/react';
import Checkout from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/Checkout',
	component: Checkout,
} as Meta<typeof Checkout>;

const template = (args) => (
	<div style={{ maxWidth: 1024 }}>
		<Checkout {...args} />
	</div>
);

export const Base: StoryObj<typeof Checkout> = {
	args: {
			contentId: 3,
			contentType: SCContentType.EVENT,
			priceId: 1
	},
	render: template
};

export const Group: StoryObj<typeof Checkout> = {
	args: {
		contentId: 4,
		contentType: SCContentType.GROUP,
		priceId: 4
	},
	render: template
};

export const Category: StoryObj<typeof Checkout> = {
	args: {
		contentId: 2,
		contentType: SCContentType.CATEGORY,
		priceId: 5
	},
	render: template
};

export const Community: StoryObj<typeof Checkout> = {
	args: {
		contentId: 1,
		contentType: SCContentType.COMMUNITY,
		priceId: 7
	},
	render: template
};


