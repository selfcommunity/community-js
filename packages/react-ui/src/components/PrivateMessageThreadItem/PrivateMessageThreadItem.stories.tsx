import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageThreadItem from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageThreadItem',
  component: PrivateMessageThreadItem
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageThreadItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageThreadItem> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageThreadItem {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
