import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserFeedTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC Templates/User Feed',
  component: UserFeedTemplate,
} as ComponentMeta<typeof UserFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFeedTemplate> = (args) => (
  <div style={{ maxWidth: '1200px', width: '100%', height: '500px' }}>
    <UserFeedTemplate {...args} />
  </div>
);

export const User = Template.bind({});

User.args = {
  userId: 1,
};
