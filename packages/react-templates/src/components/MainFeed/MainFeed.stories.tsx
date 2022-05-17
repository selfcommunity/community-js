import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import MainFeedTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Main Feed',
  component: MainFeedTemplate,
} as ComponentMeta<typeof MainFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MainFeedTemplate> = (args) => (
  <div style={{ maxWidth: '1200px', width: '100%', height: '500px' }}>
    <MainFeedTemplate {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {};
