import type { Meta, StoryObj } from '@storybook/react';
import LoyaltyProgramWidget from './index';

export default {
  title: 'Design System/React UI/Loyalty Program Widget',
  component: LoyaltyProgramWidget
} as Meta<typeof LoyaltyProgramWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidget {...args} />
  </div>
);

export const Base: StoryObj<LoyaltyProgramWidget> = {
  render: template
};

