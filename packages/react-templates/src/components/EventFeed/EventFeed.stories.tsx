import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Event Feed',
  component: EventFeedTemplate,
	argTypes: {
		eventId: {
			control: {type: 'number'},
			description: 'Event Id'
		}
	},
} as Meta<typeof EventFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof EventFeedTemplate> = {
  args: {
    eventId: 129
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <EventFeedTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof EventFeedTemplate> = {
	args: {
		eventId: 121
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1, maxWidth: '100% !important', height: '92vh', overflow: 'auto'}} id="scrollableDiv">
			<EventFeedTemplate {...args} FeedProps={{scrollableTargetId: 'scrollableDiv'}} />
		</div>;
	}
};
