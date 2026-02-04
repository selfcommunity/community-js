import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Event, { EventInfoDetailsProps } from './index';

export default {
	title: 'Design System/React UI Shared/EventInfoDetails',
	component: Event,
	argTypes: {
		eventId: {
			control: { type: 'number' },
			description: 'Event Id',
			table: { defaultValue: { summary: '1' } }
		},
		hasInProgress: {
			control: { type: 'boolean' },
			description: 'Show in progress',
			table: { defaultValue: { summary: '' } }
		},
	}
} as Meta<typeof Event>;

const template = (args: EventInfoDetailsProps) => (
	<div style={{ maxWidth: 400 }}>
		<Event {...args} />
	</div>
);

export const Base: StoryObj<typeof Event> = {
	args: {
		eventId: 117,
	},
	render: template
};

export const InProgress: StoryObj<typeof Event> = {
	args: {
		eventId: 117,
		hasInProgress: true
	},
	render: template
};
