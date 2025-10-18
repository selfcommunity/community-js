import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SCEventTemplateType } from '../../types/event';
import Event from './index';

export default {
	title: 'Design System/React UI/Event',
	component: Event,
	argTypes: {
		eventId: {
			control: { type: 'number' },
			description: 'Event Id',
			table: { defaultValue: { summary: 1 } }
		},
		elevation: {
			control: { type: 'number' },
			description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
			table: { defaultValue: { summary: 1 } }
		},
		variant: {
			options: ['elevation', 'outlined'],
			control: { type: 'select' },
			description: 'The variant to use. Types: "elevation", "outlined", etc.',
			table: { defaultValue: { summary: 'elevation' } }
		}
	}
} as Meta<typeof Event>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<Event {...args} />
	</div>
);

export const Base: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
	},
	render: template
};

export const Snippet: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		elevation: 0,
		variant: 'elevation',
		square: false
	},
	render: template
};

export const SnippetOutlined: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		elevation: 0,
		variant: 'outlined',
		square: false
	},
	render: template
};

export const Detail: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCEventTemplateType.DETAIL,
		actions: <></>
	},
	render: template
};

export const DetailCard: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		template: SCEventTemplateType.DETAIL,
		actions: <></>
	},
	render: template
};

export const Preview: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCEventTemplateType.PREVIEW,
		actions: <></>
	},
	render: template
};

export const PreviewCard: StoryObj<typeof Event> = {
	args: {
		eventId: 37,
		template: SCEventTemplateType.PREVIEW,
		actions: <></>
	},
	render: template
};
