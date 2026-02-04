import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LoyaltyProgramWidget, { LoyaltyProgramWidgetProps } from './index';

export default {
  title: 'Design System/React UI/Loyalty Program Widget',
  component: LoyaltyProgramWidget
} as Meta<typeof LoyaltyProgramWidget>;

const template = (args: LoyaltyProgramWidgetProps) => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof LoyaltyProgramWidget> = {
  render: template
};

