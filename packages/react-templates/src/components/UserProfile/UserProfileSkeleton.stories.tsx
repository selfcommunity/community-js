import type { Meta, StoryObj } from '@storybook/react';

import UserProfileSkeletonTemplate from './Skeleton';

const meta: Meta<typeof UserProfileSkeletonTemplate> = {
  title: 'Design System/React TEMPLATES/Skeleton/User Profile',
  component: UserProfileSkeletonTemplate,
};

export default meta;
type Story = StoryObj<typeof UserProfileSkeletonTemplate>;

export const Base: Story = {
  render: (args) => <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <UserProfileSkeletonTemplate {...args} />
  </div>,
};