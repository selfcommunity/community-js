import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ConsentSolutionSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/ConsentSolution',
  component: ConsentSolutionSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof ConsentSolutionSkeleton>;

const template = () => (
  <div style={{width: 600}}>
    <ConsentSolutionSkeleton />
  </div>
);

export const Base: StoryObj<typeof ConsentSolutionSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
