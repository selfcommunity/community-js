import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrizeItemSkeleton from './PrizeItemSkeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Loyalty Program Detail/Prize Item',
  component: PrizeItemSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof PrizeItemSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof PrizeItemSkeleton> = {
  render: () => (
    <div style={{width: '300px'}}>
      <PrizeItemSkeleton />
    </div>
  )
};
