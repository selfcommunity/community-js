import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CommentObjectSkeleton from './Skeleton';

export default {
  title: 'Design System/SC UI/Skeleton/CommentObject',
  component: CommentObjectSkeleton,
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
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof CommentObjectSkeleton>;

const Template: ComponentStory<typeof CommentObjectSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CommentObjectSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
