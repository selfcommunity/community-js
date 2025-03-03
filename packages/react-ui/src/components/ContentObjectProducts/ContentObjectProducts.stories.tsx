import type { Meta, StoryObj } from '@storybook/react';
import ContentObjectProducts from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/ContentObjectProducts',
	component: ContentObjectProducts,
} as Meta<typeof ContentObjectProducts>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<ContentObjectProducts {...args} />
	</div>
);

export const Base: StoryObj<typeof ContentObjectProducts> = {
	args: {
			id: 1,
			contentType: SCContentType.EVENT
	},
	render: template
};


