import type {Meta, StoryObj} from '@storybook/react-webpack5';
import LeaderboardPositionWidget, {LeaderboardPositionWidgetProps} from './index';

export default {
  title: 'Design System/React UI/Leaderboard Position Widget',
  component: LeaderboardPositionWidget
} as Meta<typeof LeaderboardPositionWidget>;

const template = (args: LeaderboardPositionWidgetProps) => (
  <div style={{width: 400}}>
    <LeaderboardPositionWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof LeaderboardPositionWidget> = {
  render: template,
  args: {
    isLoading: false,
    position: {
      position: 1,
      total_score: 3015,
      user: {
        id: 1,
        username: 'admin',
        real_name: 'Amministratore',
        avatar: 'https://static-cache.quentrix.com/wioggmfc/upfiles/avatars/1/resized/209/209/28b02add2c23b3a71801734eba773592.png',
        ext_id: null,
        deleted: false
      }
    }
  }
};
