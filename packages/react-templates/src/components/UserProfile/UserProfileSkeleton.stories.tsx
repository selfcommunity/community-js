import type { Meta, StoryObj } from '@storybook/react';

import UserProfileSkeletonTemplate from './Skeleton';

const meta: Meta<typeof UserProfileSkeletonTemplate> = {
  title: 'Design System/React TEMPLATES/Skeleton/User Profile',
  component: UserProfileSkeletonTemplate,
};

export default meta;
type Story = StoryObj<typeof UserProfileSkeletonTemplate>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Base: Story = {
  render: (args) => <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <UserProfileSkeletonTemplate {...args} />
  </div>,
};