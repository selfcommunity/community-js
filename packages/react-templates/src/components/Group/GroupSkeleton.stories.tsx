import type { Meta, StoryObj } from '@storybook/react';
import GroupSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Group',
  component: GroupSkeletonTemplate
} as Meta<typeof GroupSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof GroupSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <GroupSkeletonTemplate {...args} />
    </div>)
};