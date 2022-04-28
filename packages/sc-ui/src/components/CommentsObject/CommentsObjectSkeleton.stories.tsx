import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CommentsObjectSkeleton from './Skeleton';

export default {
  title: 'Design System/SC UI/Skeleton/CommentsObjectSkeleton',
  component: CommentsObjectSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    CommentObjectSkeletonProps: {
      elevation: 0,
      WidgetProps: {
        elevation: 1,
        variant: 'elevation'
      }
    }
  }
} as ComponentMeta<typeof CommentsObjectSkeleton>;

const Template: ComponentStory<typeof CommentsObjectSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CommentsObjectSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
