import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { UserLiveStreamWidgetSkeleton } from './index';

export default {
  title: 'Design System/React UI/Skeleton/UserLiveStreamWidget',
  component: UserLiveStreamWidgetSkeleton,
} as Meta<typeof UserLiveStreamWidgetSkeleton>;

const template = () => (
	<div style={{width: 400}}>
		<UserLiveStreamWidgetSkeleton />
	</div>
);

export const Base: StoryObj<typeof UserLiveStreamWidgetSkeleton> = {
	render: template
};
