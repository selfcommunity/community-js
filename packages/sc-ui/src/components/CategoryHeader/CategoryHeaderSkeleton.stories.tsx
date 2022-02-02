import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CategoryHeaderSkeleton from '.';

export default {
  title: 'Design System/SC UI/Skeleton/CategoryHeaderSkeleton',
  component: CategoryHeaderSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof CategoryHeaderSkeleton>;

const Template: ComponentStory<typeof CategoryHeaderSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <CategoryHeaderSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
