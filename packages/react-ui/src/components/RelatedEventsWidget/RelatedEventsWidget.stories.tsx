import type { Meta, StoryObj } from '@storybook/react';
import RelatedEventsWidget from './index';

export default {
  title: 'Design System/React UI/Related Events Widget',
  args: {
    eventId: 121
  },
  component: RelatedEventsWidget
} as Meta<typeof RelatedEventsWidget>;


export const Base: StoryObj<typeof RelatedEventsWidget> = {};
