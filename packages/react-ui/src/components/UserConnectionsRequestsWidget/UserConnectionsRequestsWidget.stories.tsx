import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserConnectionsRequestsWidget from './index';

export default {
  title: 'Design System/React UI/User Connections Requests Widget',
  component: UserConnectionsRequestsWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserConnectionsRequestsWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnectionsRequestsWidget> = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  userId: 153
};

