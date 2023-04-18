import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PrivateMessageSettingsIconButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/PrivateMessageSettingsIconButton',
  component: PrivateMessageSettingsIconButton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageSettingsIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageSettingsIconButton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSettingsIconButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
