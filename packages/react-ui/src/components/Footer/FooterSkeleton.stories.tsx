import type { Meta, StoryObj } from '@storybook/react';
import FooterSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Footer',
  component: FooterSkeleton
} as Meta<typeof FooterSkeleton>;

const template: StoryObj<typeof FooterSkeleton> = (args) => (
  <div style={{width: 1200}}>
    <FooterSkeleton {...args} />
  </div>
);

export const Base: StoryObj<FooterSkeleton> = {
  args: {
    contained: true
  },
  render: template
};