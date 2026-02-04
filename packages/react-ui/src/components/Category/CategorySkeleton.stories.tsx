import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategorySkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Category',
  component: CategorySkeleton
} as Meta<typeof CategorySkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <CategorySkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CategorySkeleton> = {
  args: {
    contained: true,
  },
  render: template
};

export const Outlined: StoryObj<typeof CategorySkeleton> = {
	args: {
		contained: false,
	},
	render: template
};
