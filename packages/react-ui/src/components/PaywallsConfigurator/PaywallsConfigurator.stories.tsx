import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaywallsConfigurator, { PaywallsConfiguratorProps } from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaywallsConfigurator',
	component: PaywallsConfigurator,
} as Meta<typeof PaywallsConfigurator>;

const template = (args: PaywallsConfiguratorProps) => (
	<div style={{ maxWidth: 400 }}>
		<PaywallsConfigurator {...args} />
	</div>
);

export const Base: StoryObj<typeof PaywallsConfigurator> = {
	args: {
			contentId: 1,
			contentType: SCContentType.EVENT
	},
	render: template
};


