import type {Meta, StoryObj} from '@storybook/react-webpack5';
import LeaderboardWidgetSkeleton, {LeaderboardWidgetSkeletonProps} from './Skeleton';

export default {
  title: 'Design System/React UI/Leaderboard Widget/Skeleton',
  component: LeaderboardWidgetSkeleton
} as Meta<typeof LeaderboardWidgetSkeleton>;

const template = (args: LeaderboardWidgetSkeletonProps) => (
  <div style={{width: 400}}>
    <LeaderboardWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof LeaderboardWidgetSkeleton> = {
  render: template
};

export const Podium: StoryObj<typeof LeaderboardWidgetSkeleton> = {
  render: template,
  args: {
    mode: 'podium'
  }
};
