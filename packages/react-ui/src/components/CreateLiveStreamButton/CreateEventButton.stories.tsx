import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CreateLiveStreamButton from './index';

export default {
  title: 'Design System/React UI/Livestream/CreateLivestreamButton',
  component: CreateLiveStreamButton,
} as Meta<typeof CreateLiveStreamButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateLiveStreamButton {...args} />
  </div>
);

export const Base: StoryObj<typeof CreateLiveStreamButton> = {
  args: {
		onSuccess: () => {
			console.log('test');
		}
	},
  render: template
};
