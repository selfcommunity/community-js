import type {Meta, StoryObj} from '@storybook/react-webpack5';
import LeaderboardPositionWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Leaderboard Position Widget',
  component: LeaderboardPositionWidgetSkeleton
} as Meta<typeof LeaderboardPositionWidgetSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <LeaderboardPositionWidgetSkeleton />
  </div>
);

export const Base: StoryObj<typeof LeaderboardPositionWidgetSkeleton> = {
  render: template
};
