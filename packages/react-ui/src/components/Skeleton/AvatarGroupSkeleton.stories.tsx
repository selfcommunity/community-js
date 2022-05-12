import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AvatarGroupSkeleton from './AvatarGroupSkeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/AvatarGroup',
  component: AvatarGroupSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AvatarGroupSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AvatarGroupSkeleton> = (args) => (
  <div style={{width: 400}}>
    <AvatarGroupSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
