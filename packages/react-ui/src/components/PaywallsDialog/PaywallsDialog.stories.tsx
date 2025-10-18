import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PaywallsDialog from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/PaywallsDialog',
	component: PaywallsDialog,
} as Meta<typeof PaywallsDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PaywallsDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof PaywallsDialog> = {
	args: {
		PaywallsComponentProps: {
			contentId: 1,
			contentType: SCContentType.EVENT
		}
	},
	render: template
};


