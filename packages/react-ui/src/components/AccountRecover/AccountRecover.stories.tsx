import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import AccountRecover from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Account Recover',
  component: AccountRecover
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AccountRecover>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountRecover> = (args) => (
  <div style={{width: 400}}>
    <AccountRecover {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  onSuccess: () => alert('success')
};
