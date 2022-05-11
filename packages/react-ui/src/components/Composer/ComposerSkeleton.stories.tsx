import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ComposerSkeleton from './Skeleton';

export default {
  title: 'Design System/SC UI/Skeleton/Composer',
  component: ComposerSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof ComposerSkeleton>;

const Template: ComponentStory<typeof ComposerSkeleton> = (args) => (
  <div style={{width: 400}}>
    <ComposerSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
