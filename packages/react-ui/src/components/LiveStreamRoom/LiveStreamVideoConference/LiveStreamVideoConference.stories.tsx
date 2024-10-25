import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamVideoConference from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamVideoConference',
  component: LiveStreamVideoConference,
} as Meta<typeof LiveStreamVideoConference>;

const template = (args) => (
  <div>
    <LiveStreamVideoConference {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamVideoConference> = {
  args: {
		startConferenceEndContent: <>Test</>,
	},
  render: template
};
