import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjectTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Explore Feed',
  component: FeedObjectTemplate
} as ComponentMeta<typeof FeedObjectTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjectTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectTemplate {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {};
