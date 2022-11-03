import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UsersListTemplate from './index';
import {Endpoints} from '@selfcommunity/api-services';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Users List',
  component: UsersListTemplate,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    userId: 7,
    endpoint: {
      ...Endpoints.UserFollowers,
      url: () => Endpoints.UserFollowers.url({id: 7})
    },
    showFollowers: true
  }
} as ComponentMeta<typeof UsersListTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersListTemplate> = (args) => {

  return (
    <div style={{width: '100%'}}>
      <UsersListTemplate {...args}/>
    </div>
  );
};

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};

