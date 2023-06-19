import type { Meta, StoryObj } from '@storybook/react';
import Incubator from './index';

export default {
  title: 'Design System/React UI/Incubator',
  component: Incubator,
  argTypes: {
    incubatorId: {
      control: {type: 'number'},
      description: 'Incubator Id',
      table: {defaultValue: {summary: 1}}
    },
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
  }
} as Meta<typeof Incubator>;

const template = (args) => (
  <div style={{width: 400}}>
    <Incubator {...args} />
  </div>
);

export const Base: StoryObj<Incubator> = {
  args: {
    elevation: 1,
    variant: 'elevation',
    incubatorId: 1
  },
  render: template
};