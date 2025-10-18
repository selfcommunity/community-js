import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GenericSkeleton from './GenericSkeleton';

export default {
  title: 'Design System/React UI/Skeleton/Generic',
  component: GenericSkeleton
} as Meta<typeof GenericSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GenericSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GenericSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
