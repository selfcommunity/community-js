import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ChangePicture from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ChangePicture',
  component: ChangePicture
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ChangePicture>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ChangePicture> = (args) => (
  <div style={{width: 400}}>
    <ChangePicture {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
