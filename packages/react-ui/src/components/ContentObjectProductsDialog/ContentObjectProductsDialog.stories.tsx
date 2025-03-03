import type { Meta, StoryObj } from '@storybook/react';
import ContentObjectProductsDialog from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/ContentObjectProductsDialog',
	component: ContentObjectProductsDialog,
} as Meta<typeof ContentObjectProductsDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<ContentObjectProductsDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof ContentObjectProductsDialog> = {
	args: {
		ContentObjectPricesComponentProps: {
			id: 1,
			contentType: SCContentType.EVENT
		}
	},
	render: template
};


