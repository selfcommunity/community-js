import type { Meta, StoryObj } from '@storybook/react';
import LoyaltyProgramDetailSkeleton from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Loyalty Program Detail',
  component: LoyaltyProgramDetailSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof LoyaltyProgramDetailSkeleton>;

export const Base: StoryObj<typeof LoyaltyProgramDetailSkeleton> = {render: (args) => (
    <LoyaltyProgramDetailSkeleton {...args} />
)};