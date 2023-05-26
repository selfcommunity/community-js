import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserConnections from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/User Connections',
  component: UserConnections
} as ComponentMeta<typeof UserConnections>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnections> = (args) => (
  <div style={{maxWidth: '1000px', width: '100%', height: '500px'}}>
    <UserConnections {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  userId: 1
};
