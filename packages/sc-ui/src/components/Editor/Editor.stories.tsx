import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Editor from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Editor',
  component: Editor
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Editor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Editor> = (args) => (
  <div style={{width: 400}}>
    <Editor {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
