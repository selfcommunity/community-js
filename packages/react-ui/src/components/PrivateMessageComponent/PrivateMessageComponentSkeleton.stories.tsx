import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageComponentSkeleton, { PrivateMessageComponentProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageComponent',
  component: PrivateMessageComponentSkeleton
} as Meta<typeof PrivateMessageComponentSkeleton>;

const template = (args: PrivateMessageComponentProps) => (
  <div style={{width: 400}}>
    <PrivateMessageComponentSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageComponentSkeleton> = {
  render: template
};