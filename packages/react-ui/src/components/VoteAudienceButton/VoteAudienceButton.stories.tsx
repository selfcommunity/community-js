import type { Meta, StoryObj } from '@storybook/react-webpack5';
import VoteAudienceButton, { VoteAudienceButtonProps } from './index';
import { SCContributionType } from '@selfcommunity/types';


export default {
  title: 'Design System/React UI/Vote Audience Button ',
  component: VoteAudienceButton,
} as Meta<typeof VoteAudienceButton>;


const template = (args: VoteAudienceButtonProps) => (
  <div style={{width: '100%'}}>
    <VoteAudienceButton {...args} />
  </div>
);

export const Base: StoryObj<typeof VoteAudienceButton> =  {
  args: {
    contributionId: 1171,
    contributionType: SCContributionType.POST,
    size: 'medium'
  },
  render: template
};
