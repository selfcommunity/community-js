import type { Meta, StoryObj } from '@storybook/react-webpack5';
import VoteButton, { VoteButtonProps } from './index';
import { SCContributionType } from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/Vote Button ',
  component: VoteButton,
} as Meta<typeof VoteButton>;


const template = (args: VoteButtonProps) => (
  <div style={{width: '100%'}}>
    <VoteButton {...args} />
  </div>
);

export const Base: StoryObj<typeof VoteButton> = {
  args: {
    contributionId: 1171,
    contributionType: SCContributionType.POST
  },
  render: template
};
