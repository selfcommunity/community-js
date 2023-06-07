import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AccountDataPortabilityButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Account Data Portability Button ',
  component: AccountDataPortabilityButton,
  argTypes: {},
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountDataPortabilityButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountDataPortabilityButton> = (args) => (
  <div style={{width: '100%'}}>
    <AccountDataPortabilityButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contributionId: 1171,
  contributionType: 'post',
  size: 'medium'
};
