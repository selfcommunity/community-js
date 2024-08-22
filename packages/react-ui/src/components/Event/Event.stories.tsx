import type { Meta, StoryObj } from '@storybook/react';
import Event from './index';
import {SCEventTemplateType} from '../../types/event';

export default {
  title: 'Design System/React UI/Event',
  component: Event,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'Event Id',
      table: {defaultValue: {summary: 1}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
} as Meta<typeof Event>;

const template = (args) => (
  <div style={{maxWidth: 500}}>
    <Event {...args} />
  </div>
);

export const Base: StoryObj<Event> = {
	args: {
		eventId: 101,
	},
	render: template
};

export const Snippet: StoryObj<Event> = {
  args: {
    eventId: 101,
		elevation: 0,
		variant: 'elevation',
		square: false
	},
  render: template
};

export const Detail: StoryObj<Event> = {
	args: {
		eventId: 101,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCEventTemplateType.DETAIL,
		actions: <></>
	},
	render: template
};

export const DetailCard: StoryObj<Event> = {
	args: {
		eventId: 101,
		template: SCEventTemplateType.DETAIL,
		actions: <></>
	},
	render: template
};

export const Preview: StoryObj<Event> = {
	args: {
		eventId: 101,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCEventTemplateType.PREVIEW,
		actions: <></>
	},
	render: template
};

export const PreviewCard: StoryObj<Event> = {
	args: {
		eventId: 101,
		template: SCEventTemplateType.PREVIEW,
		actions: <></>
	},
	render: template
};
