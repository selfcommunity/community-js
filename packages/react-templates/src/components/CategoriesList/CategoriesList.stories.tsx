import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import CategoriesListTemplate from './index';
import {Endpoints} from '@selfcommunity/api-services';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Categories List',
  component: CategoriesListTemplate,
  argTypes: {
  },
  args: {}
} as ComponentMeta<typeof CategoriesListTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesListTemplate> = (args) => {

  return (
    <div style={{width: '100%'}}>
      <CategoriesListTemplate {...args}/>
    </div>
  );
};

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};

