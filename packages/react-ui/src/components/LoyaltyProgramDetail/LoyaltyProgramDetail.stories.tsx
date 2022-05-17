import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import LoyaltyProgramDetail from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Loyalty Program Detail',
  component: LoyaltyProgramDetail
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramDetail>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramDetail> = (args) => <LoyaltyProgramDetail {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
