import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import LoyaltyProgramCard from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Loyalty Program Card',
  component: LoyaltyProgramCard
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramCard> = (args) => <LoyaltyProgramCard {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
