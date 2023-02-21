import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PrivateMessageActionMenu from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageActionMenu',
  component: PrivateMessageActionMenu
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageActionMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageActionMenu> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageActionMenu {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
