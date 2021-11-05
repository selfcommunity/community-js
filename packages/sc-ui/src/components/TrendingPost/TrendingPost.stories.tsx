import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingPost from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Trending Post',
  component: TrendingPost
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingPost>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingPost> = (args) => (
  <div style={{width: 500}}>
    <TrendingPost scInterestId={9} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
