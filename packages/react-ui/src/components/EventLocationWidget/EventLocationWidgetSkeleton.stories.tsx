import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventLocationWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/EventLocationWidget',
  component: EventLocationWidgetSkeleton
} as Meta<typeof EventLocationWidgetSkeleton>;

const template = () => (
  <EventLocationWidgetSkeleton />
);

export const Base: StoryObj<typeof EventLocationWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
