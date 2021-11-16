import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CentralProgress from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SHARED COMPONENT/CentralProgress',
  component: CentralProgress,
  argTypes: {
    size: {
      control: {type: 'number'},
      description: 'Size of the circular progress.',
      defaultValue: 1,
      table: {defaultValue: {summary: 30}}
    }
  }
} as ComponentMeta<typeof CentralProgress>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CentralProgress> = (args) => <CentralProgress {...args} />;

export const Base = Template.bind({});

Base.args = {
  size: 30
};
