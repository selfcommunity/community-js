import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LoyaltyProgramWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LoyaltyProgramWidget',
  component: LoyaltyProgramWidgetSkeleton
} as Meta<typeof LoyaltyProgramWidgetSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidgetSkeleton />
  </div>
);

export const Base: StoryObj<typeof LoyaltyProgramWidgetSkeleton> = {
  render: template
};
