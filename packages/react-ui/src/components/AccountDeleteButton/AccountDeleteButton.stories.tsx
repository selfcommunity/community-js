import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AccountDeleteButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Account Delete Button ',
  component: AccountDeleteButton,
  argTypes: {},
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountDeleteButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountDeleteButton> = (args) => (
  <div style={{width: '100%'}}>
    <AccountDeleteButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contributionId: 1171,
  contributionType: 'post',
  size: 'medium'
};
