import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserInfoDialog from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Info Dialog',
  component: UserInfoDialog
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserInfoDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-ignore
const Template: ComponentStory<typeof UserInfoDialog> = (args) => (
  <div style={{width: 400}}>
    <UserInfoDialog {...args}></UserInfoDialog>
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  open: true,
  userId: 1,
  onClose: () => null
};
