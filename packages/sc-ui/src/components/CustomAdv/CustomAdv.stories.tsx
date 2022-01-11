import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CustomAdv from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CustomAdv',
  component: CustomAdv
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CustomAdv>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CustomAdv> = (args) => (
  <div style={{width: 400}}>
    <CustomAdv {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  position: 'BELOW_TOPBAR'
};
