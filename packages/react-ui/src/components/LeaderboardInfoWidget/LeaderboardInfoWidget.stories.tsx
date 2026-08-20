import type {Meta, StoryObj} from '@storybook/react-webpack5';
import LeaderboardInfoWidget, {LeaderboardInfoWidgetProps} from './index';

export default {
  title: 'Design System/React UI/Leaderboard Info Widget',
  component: LeaderboardInfoWidget
} as Meta<typeof LeaderboardInfoWidget>;

const template = (args: LeaderboardInfoWidgetProps) => (
  <div style={{width: 400}}>
    <LeaderboardInfoWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof LeaderboardInfoWidget> = {
  render: template
};
