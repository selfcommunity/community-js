import type { Meta, StoryObj } from '@storybook/react';
import IncubatorListWidget from './index';

export default {
  title: 'Design System/React UI/IncubatorListWidget',
  component: IncubatorListWidget,
} as Meta<typeof IncubatorListWidget>;


const template = (args) => (
  <div style={{width: 500}}>
    <IncubatorListWidget {...args} />
  </div>
);

export const Base: StoryObj<IncubatorListWidget> = {
  render: template
};