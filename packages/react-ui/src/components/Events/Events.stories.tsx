import type { Meta, StoryObj } from '@storybook/react';
import {prefetchedEvents} from './prefetchedEvents';
import Events from './index';
import EventsSkeleton from './Skeleton';
import { Endpoints } from '@selfcommunity/api-services';
import {SCEventTemplateType} from '../../types/event';

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
    endpoint: Endpoints.GetUserEvents,
		general: false,
		showFilters: true,
	},
	render: template
};

export const MyEventsCards: StoryObj<Events> = {
	args: {
		endpoint: Endpoints.GetUserEvents,
		general: false,
		showFilters: true,
		GridContainerComponentProps: {spacing: {md: 3}},
		GridItemComponentProps: {md: 3},
		EventComponentProps: {template: SCEventTemplateType.PREVIEW},
		EventSkeletonComponentProps: {template: SCEventTemplateType.PREVIEW},
		EventsSkeletonComponentProps: {
			eventsNumber: 4,
			GridContainerComponentProps: {spacing: {md: 3}},
			GridItemComponentProps: {md: 3}
		},
	},
	render: template
};

export const BasePrefetchedEvents: StoryObj<Events> = {
  args: {
    prefetchedEvents
  },
  render: template
};
