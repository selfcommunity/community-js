import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CommunityPaywalls, { CommunityPaywallsProps } from './index';

export default {
	title: 'Design System/React UI/Payments/CommunityPaywalls',
	component: CommunityPaywalls,
} as Meta<typeof CommunityPaywalls>;

const template = (args: CommunityPaywallsProps) => (
	<div style={{ maxWidth: 1600 }}>
		<CommunityPaywalls {...args} />
	</div>
);

export const Base: StoryObj<typeof CommunityPaywalls> = {
	args: {},
	render: template
};


