import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import NavigationSettingsIconButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Navigation Settings Icon Button',
  component: NavigationSettingsIconButton,
  argTypes: {
  },
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof NavigationSettingsIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavigationSettingsIconButton> = (args) => (
  <div style={{width: '100%'}}>
    <NavigationSettingsIconButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
