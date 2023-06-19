import type { Meta, StoryObj } from '@storybook/react';
import ConsentSolutionSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/ConsentSolution',
  component: ConsentSolutionSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof ConsentSolutionSkeleton>;

const template = (args) => (
  <div style={{width: 600}}>
    <ConsentSolutionSkeleton {...args} />
  </div>
);

export const Base: StoryObj<ConsentSolutionSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
