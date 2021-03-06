import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import AccountSignIn from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Account Sign In',
  component: AccountSignIn
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountSignIn>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountSignIn> = (args) => (
  <div style={{width: 400}}>
    <AccountSignIn {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  onSuccess: (data) => console.log(data)
};
