import type { Meta, StoryObj } from '@storybook/react-webpack5';
import MyEventsWidget from './index';

export default {
  title: 'Design System/React UI/My Events Widget',
  component: MyEventsWidget
} as Meta<typeof MyEventsWidget>;

export const Base: StoryObj<typeof MyEventsWidget> = {};
