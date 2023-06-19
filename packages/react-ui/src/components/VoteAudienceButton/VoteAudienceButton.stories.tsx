import type { Meta, StoryObj } from '@storybook/react';
import VoteAudienceButton from './index';


export default {
  title: 'Design System/React UI/Vote Audience Button ',
  component: VoteAudienceButton,
} as Meta<typeof VoteAudienceButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <VoteAudienceButton {...args} />
  </div>
);

export const Base: StoryObj<VoteAudienceButton> =  {
  args: {
    contributionId: 1171,
    contributionType: 'post',
    size: 'medium'
  },
  render: template
};
