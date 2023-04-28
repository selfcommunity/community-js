import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CategoryFollowersButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Category Followers Button ',
  component: CategoryFollowersButton,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    categoryId: 1
  }
} as ComponentMeta<typeof CategoryFollowersButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryFollowersButton> = (args) => (
  <div style={{width: '100%'}}>
    <CategoryFollowersButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
