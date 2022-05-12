import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import ExploreFeedTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Explore Feed',
  component: ExploreFeedTemplate
} as ComponentMeta<typeof ExploreFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExploreFeedTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <ExploreFeedTemplate {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {};
