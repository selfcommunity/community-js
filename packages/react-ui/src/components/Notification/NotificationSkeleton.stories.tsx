import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NotificationSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Notification',
  component: NotificationSkeleton,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof NotificationSkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <NotificationSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof NotificationSkeleton> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
