import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CategoryHeader from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CategoryHeader ',
  component: CategoryHeader,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    },
  },
  args: {
    id: 1,
  }
} as ComponentMeta<typeof CategoryHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryHeader> = (args) => (
  <div style={{width: '100%'}}>
    <CategoryHeader {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
