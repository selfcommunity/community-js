import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import LoyaltyProgram from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Loyalty Program',
  component: LoyaltyProgram
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgram>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgram> = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgram {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
