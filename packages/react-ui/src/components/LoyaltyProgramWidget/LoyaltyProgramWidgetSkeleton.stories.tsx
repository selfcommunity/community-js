import type { Meta, StoryObj } from '@storybook/react';
import LoyaltyProgramWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LoyaltyProgramWidget',
  component: LoyaltyProgramWidgetSkeleton
} as Meta<typeof LoyaltyProgramWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<LoyaltyProgramWidgetSkeleton> = {
  render: template
};
