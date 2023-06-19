import type { Meta, StoryObj } from '@storybook/react';

import LoyaltyProgramDetail from './index';

export default {
  title: 'Design System/React TEMPLATES/Loyalty Program Detail',
  component: LoyaltyProgramDetail
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof LoyaltyProgramDetail>;

export const Base: StoryObj<typeof LoyaltyProgramDetail> = {
  render: (args) => <LoyaltyProgramDetail {...args} />
};

