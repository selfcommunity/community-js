import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PrivateMessageSnippetItem from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItem
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageSnippetItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageSnippetItem> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItem {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
