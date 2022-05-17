import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ChangeCover from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ChangeCover',
  component: ChangeCover
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ChangeCover>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ChangeCover> = (args) => (
  <div style={{width: 400}}>
    <ChangeCover {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
