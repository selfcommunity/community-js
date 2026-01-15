import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventInfoWidget from './index';

export default {
  title: 'Design System/React UI/Event Info Widget',
  component: EventInfoWidget,
  args: {
    eventId: 114,
    summaryExpanded: false,
    hasInProgress: false,
  }
} as Meta<typeof EventInfoWidget>;

export const Base: StoryObj<typeof EventInfoWidget> = {};
