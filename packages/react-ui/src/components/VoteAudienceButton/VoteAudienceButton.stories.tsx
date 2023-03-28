import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import VoteAudienceButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Vote Audience Button ',
  component: VoteAudienceButton,
  argTypes: {},
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof VoteAudienceButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VoteAudienceButton> = (args) => (
  <div style={{width: '100%'}}>
    <VoteAudienceButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contributionId: 1171,
  contributionType: 'post',
  size: 'medium'
};
