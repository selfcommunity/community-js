import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserProfileSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/User Profile',
  component: UserProfileSkeletonTemplate
} as ComponentMeta<typeof UserProfileSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <UserProfileSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
