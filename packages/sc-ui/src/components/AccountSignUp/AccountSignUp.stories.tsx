import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import AccountSignUp from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Account Sign Up',
  component: AccountSignUp
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountSignUp>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountSignUp> = (args) => (
  <div style={{width: 400}}>
    <AccountSignUp {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
