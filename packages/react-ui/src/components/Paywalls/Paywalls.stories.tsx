import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Paywalls from './index';
import {SCContentType} from '@selfcommunity/types';

export default {
	title: 'Design System/React UI/Payments/Paywalls',
	component: Paywalls,
} as Meta<typeof Paywalls>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<Paywalls {...args} />
	</div>
);

export const Base: StoryObj<typeof Paywalls> = {
	args: {
			contentId: 1,
			contentType: SCContentType.EVENT
	},
	render: template
};


