import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SCPeopleSuggestion from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/People Suggestion',
  component: SCPeopleSuggestion,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SCPeopleSuggestion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SCPeopleSuggestion> = (args) => <div style={{width: 400}}><SCPeopleSuggestion {...args} /></div>;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
