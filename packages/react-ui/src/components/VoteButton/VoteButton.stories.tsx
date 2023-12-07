import type { Meta, StoryObj } from '@storybook/react';
import VoteButton from './index';

export default {
  title: 'Design System/React UI/Vote Button ',
  component: VoteButton,
} as Meta<typeof VoteButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <VoteButton {...args} />
  </div>
);

export const Base: StoryObj<VoteButton> = {
  args: {
    contributionId: 1171,
    contributionType: 'post'
  },
  render: template
};
