import type { Meta, StoryObj } from '@storybook/react-webpack5';
import FooterSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Footer',
  component: FooterSkeleton
} as Meta<typeof FooterSkeleton>;

const template = (args: any) => (
  <div style={{width: 1200}}>
    <FooterSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof FooterSkeleton> = {
  args: {
    contained: true
  },
  render: template
};