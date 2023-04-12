import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ComposerIconButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Composer Icon Button',
  component: ComposerIconButton,
  argTypes: {
  },
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ComposerIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ComposerIconButton> = (args) => (
  <div style={{width: '100%'}}>
    <ComposerIconButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
