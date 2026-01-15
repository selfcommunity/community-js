import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MyEventsWidgetSkeleton } from './index';

export default {
  title: 'Design System/React UI/Skeleton/My Events Widget',
  component: MyEventsWidgetSkeleton
} as Meta<typeof MyEventsWidgetSkeleton>;

export const Base: StoryObj<typeof MyEventsWidgetSkeleton> = {};