import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import LoyaltyProgramWidget from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Loyalty Program Widget',
  component: LoyaltyProgramWidget
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramWidget> = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
