import type { Meta, StoryObj } from '@storybook/react-webpack5';
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

export const Base: StoryObj<typeof EventsSkeleton> = {
  render: template
};

export const MyEvents: StoryObj<typeof Events> = {
	args: {
    endpoint: Endpoints.GetUserEvents,
		general: false,
		showFilters: true,
	},
	render: template
};

export const EventsCards: StoryObj<typeof Events> = {
  args: {
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

export const MyEventsCards: StoryObj<typeof Events> = {
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

export const BasePrefetchedEvents: StoryObj<typeof Events> = {
  args: {
    prefetchedEvents
  },
  render: template
};
