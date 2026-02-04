import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ChangeCover, { ChangeCoverProps } from './index';

export default {
  title: 'Design System/React UI/Change Cover',
  component: ChangeCover
} as Meta<typeof ChangeCover>;

const template = (args: ChangeCoverProps) => (
  <div style={{width: 400}}>
    <ChangeCover {...args} />
  </div>
);

export const Base: StoryObj<typeof ChangeCover> = {
  render: template
};

