import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Message from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Message',
  component: Message
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Message>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Message> = (args) => (
  <div style={{width: 400}}>
    <Message {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
