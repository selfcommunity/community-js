import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PrivateMessageComponent from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageComponent',
  component: PrivateMessageComponent
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageComponent> = (args) => <PrivateMessageComponent {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
