import type {Meta, StoryObj} from '@storybook/react';
import SCUpScalingTierBadge, {UpScalingTierProps} from './index';

export default {
  title: 'Design System/React UI Shared/SCUpScalingTierBadge',
  component: SCUpScalingTierBadge
} as Meta<typeof SCUpScalingTierBadge>;

const template = (args: UpScalingTierProps) => <SCUpScalingTierBadge {...args} />;

export const Base: StoryObj<typeof SCUpScalingTierBadge> = {
  render: template
};
