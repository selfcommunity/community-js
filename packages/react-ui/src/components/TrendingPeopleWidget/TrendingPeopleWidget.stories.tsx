import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingPeopleWidget from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Trending People Widget',
  component: TrendingPeopleWidget
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingPeopleWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingPeopleWidget> = (args) => (
  <div style={{width: 400}}>
    <TrendingPeopleWidget categoryId={1} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
