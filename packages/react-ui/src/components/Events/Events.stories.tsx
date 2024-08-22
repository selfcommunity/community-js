import type { Meta, StoryObj } from '@storybook/react';
import {prefetchedEvents} from './prefetchedEvents';
import Events from './index';
import EventsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Events',
  component: Events,
  argTypes: {
    showFilters: {
      control: {type: 'boolean'},
      description: 'Show/Hide filters.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    showFilters: true,
  }
} as Meta<typeof Events>;

const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Events {...args} />
  </div>
);

export const Base: StoryObj<EventsSkeleton> = {
  render: template
};

export const MyEvents: StoryObj<Events> = {
	args: {
		general: false,
		showFilters: false
	},
	render: template
};

export const BasePrefetchedEvents: StoryObj<Events> = {
  args: {
    prefetchedEvents
  },
  render: template
};
