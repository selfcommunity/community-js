import type { Meta, StoryObj } from '@storybook/react';
import IncubatorSuggestionWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/IncubatorSuggestionWidget',
  component: IncubatorSuggestionWidgetSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof IncubatorSuggestionWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 500}}>
    <IncubatorSuggestionWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<IncubatorSuggestionWidgetSkeleton> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};