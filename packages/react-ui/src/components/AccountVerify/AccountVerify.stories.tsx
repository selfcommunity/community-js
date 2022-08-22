import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import AccountVerify from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Account Verify',
  component: AccountVerify
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountVerify>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountVerify> = (args) => (
  <div style={{width: 400}}>
    <AccountVerify {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  validationCode: ''
};
