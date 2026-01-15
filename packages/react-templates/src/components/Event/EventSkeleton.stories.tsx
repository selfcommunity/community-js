import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Event',
  component: EventSkeletonTemplate
} as Meta<typeof EventSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof EventSkeletonTemplate> = {
  render: () => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <EventSkeletonTemplate />
    </div>)
};
