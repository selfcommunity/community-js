import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import FeedSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Feed',
  component: FeedSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof FeedSkeleton>;

const Template: ComponentStory<typeof FeedSkeleton> = (args) => (
  <div style={{width: 1280}}>
    <FeedSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
