import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PrivateMessageActionDrawer from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageActionMenu',
  component: PrivateMessageActionDrawer
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageActionDrawer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageActionDrawer> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageActionDrawer {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
