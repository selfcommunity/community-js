import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolutionSwitch from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI Shared/ConsentSolutionSwitch',
  component: ConsentSolutionSwitch
} as ComponentMeta<typeof ConsentSolutionSwitch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ConsentSolutionSwitch> = (args) => <ConsentSolutionSwitch {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};

export const Loading = Template.bind({});

Loading.args = {
  loading: true
};
