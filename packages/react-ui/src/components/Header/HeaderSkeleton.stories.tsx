import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import HeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Header',
  component: HeaderSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof HeaderSkeleton>;

const Template: ComponentStory<typeof HeaderSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <HeaderSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
