import type { Meta, StoryObj } from '@storybook/react';
import CommunityPaywalls from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/CommunityPaywalls',
	component: CommunityPaywalls,
} as Meta<typeof CommunityPaywalls>;

const template = (args) => (
	<div style={{ maxWidth: 1600 }}>
		<CommunityPaywalls {...args} />
	</div>
);

export const Base: StoryObj<typeof CommunityPaywalls> = {
	args: {},
	render: template
};


