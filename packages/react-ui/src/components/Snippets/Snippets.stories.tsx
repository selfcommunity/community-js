import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Snippets from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Snippets',
  component: Snippets
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Snippets>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Snippets> = (args) => (
    <Snippets {...args} />
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
