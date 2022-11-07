import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserSocialAssociation from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Social Association ',
  component: UserSocialAssociation,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  },
  args: {
    userId: 417
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserSocialAssociation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserSocialAssociation> = (args) => (
  <div style={{width: '100%'}}>
    <UserSocialAssociation {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  spacing: 2,
  direction: 'row',
  onCreateAssociation: (name) => () => console.log(name)
};
