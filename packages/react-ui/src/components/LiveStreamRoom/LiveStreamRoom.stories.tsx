import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LiveStreamRoom, { LiveStreamRoomProps } from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamRoom',
  component: LiveStreamRoom,
} as Meta<typeof LiveStreamRoom>;

const template = (args: LiveStreamRoomProps) => (
 	<LiveStreamRoom {...args} />
);


export const Base: StoryObj<typeof LiveStreamRoom> = {
  args: {
		liveStreamId: 1
	},
  render: template
};
