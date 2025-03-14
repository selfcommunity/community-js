import type { Meta, StoryObj } from '@storybook/react';
import CommunityPaywall from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/CommunityPaywall',
	component: CommunityPaywall,
} as Meta<typeof CommunityPaywall>;

const template = (args) => (
	<div style={{ maxWidth: 1024 }}>
		<CommunityPaywall {...args} />
	</div>
);

export const Base: StoryObj<typeof CommunityPaywall> = {
	args: {},
	render: template
};


