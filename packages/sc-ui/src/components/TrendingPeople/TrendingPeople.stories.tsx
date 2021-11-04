import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingPeople from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Trending People',
  component: TrendingPeople
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingPeople>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingPeople> = (args) => (
  <div style={{width: 400}}>
    <TrendingPeople scInterestId={1} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
