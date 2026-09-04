import type {Meta, StoryObj} from '@storybook/react-webpack5';
import {SCLeaderboardEntry} from '@selfcommunity/types';
import LeaderboardWidget, {LeaderboardWidgetProps} from './index';

export default {
  title: 'Design System/React UI/Leaderboard Widget',
  component: LeaderboardWidget
} as Meta<typeof LeaderboardWidget>;

const entries: SCLeaderboardEntry[] = Array.from({length: 5}, (_, index) => ({
  position: index + 1,
  total_score: 1000 - index * 120,
  user: {
    id: index + 1,
    username: `user${index + 1}`,
    real_name: `User ${index + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
    ext_id: null,
    deleted: false
  }
}));

const template = (args: LeaderboardWidgetProps) => (
  <div style={{width: 400}}>
    <LeaderboardWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    entries,
    isLoading: false
  }
};

export const Podium: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    mode: 'podium',
    entries,
    isLoading: false
  }
};

export const WeeklyPodium: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    mode: 'podium',
    period: 'week',
    entries,
    isLoading: false
  }
};

export const AnnualPodium: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    mode: 'podium',
    period: 'year',
    entries,
    isLoading: false
  }
};

export const Loading: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    entries: [],
    isLoading: true
  }
};

export const FullAutoFetch: StoryObj<typeof LeaderboardWidget> = {
  render: template,
  args: {
    mode: 'full'
  }
};
