import type { Meta, StoryObj } from '@storybook/react';
import SuggestedEventsWidget from './index';

export default {
	title: 'Design System/React UI/Suggested Events Widget',
	component: SuggestedEventsWidget
} as Meta<typeof SuggestedEventsWidget>;



const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<SuggestedEventsWidget {...args} />
	</div>
);

export const Base: StoryObj<typeof SuggestedEventsWidget> = {
	render: template
};

