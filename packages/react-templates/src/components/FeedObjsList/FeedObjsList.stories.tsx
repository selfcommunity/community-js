import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjsListTemplate from './index';
import {Endpoints} from '@selfcommunity/api-services';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Feed Objs List',
  component: FeedObjsListTemplate,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    categoryId: 1,
    endpoint: {
      ...Endpoints.CategoryTrendingFeed,
      url: () => Endpoints.CategoryTrendingFeed.url({id: 1})
    },
  }
} as ComponentMeta<typeof FeedObjsListTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjsListTemplate> = (args) => {

  return (
    <div style={{width: '100%'}}>
      <FeedObjsListTemplate {...args}/>
    </div>
  );
};

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};

