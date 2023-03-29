import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import VoteButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Vote Button ',
  component: VoteButton,
  argTypes: {},
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof VoteButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VoteButton> = (args) => (
  <div style={{width: '100%'}}>
    <VoteButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contributionId: 1171,
  contributionType: 'post'
};
