import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/User Feed',
  component: UserFeedTemplate
} as Meta<typeof UserFeedTemplate>;

export const Base: StoryObj<typeof UserFeedTemplate> = {
  args: {
    userId: 10
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <UserFeedTemplate {...args} />
    </div>
  )
}
