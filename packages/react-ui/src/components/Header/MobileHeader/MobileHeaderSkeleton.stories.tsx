import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import MobileHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/MobileHeader',
  component: MobileHeaderSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof MobileHeaderSkeleton>;

const Template: ComponentStory<typeof MobileHeaderSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <MobileHeaderSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
