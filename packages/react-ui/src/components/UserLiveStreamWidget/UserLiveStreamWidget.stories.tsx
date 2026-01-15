import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserLiveStreamWidget from './index';

export default {
  title: 'Design System/React UI/LiveStream/User LiveStream Widget',
  args: {
    userId: 1
  },
  component: UserLiveStreamWidget
} as Meta<typeof UserLiveStreamWidget>;


export const Base: StoryObj<typeof UserLiveStreamWidget> = {};
