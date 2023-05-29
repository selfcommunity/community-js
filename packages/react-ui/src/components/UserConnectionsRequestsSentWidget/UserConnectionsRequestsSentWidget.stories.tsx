import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserConnectionsRequestsSentWidget from './index';

export default {
  title: 'Design System/React UI/User Connections Requests Sent Widget',
  component: UserConnectionsRequestsSentWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserConnectionsRequestsSentWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnectionsRequestsSentWidget> = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSentWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  userId: 153
};

