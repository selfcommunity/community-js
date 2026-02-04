import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ChangeGroupCover, { ChangeGroupCoverProps } from './index';

export default {
  title: 'Design System/React UI/Change Group Cover',
  component: ChangeGroupCover
} as Meta<typeof ChangeGroupCover>;

const template = (args: ChangeGroupCoverProps) => (
  <div style={{width: 400}}>
    <ChangeGroupCover {...args} />
  </div>
);

export const Base: StoryObj<typeof ChangeGroupCover> = {
  render: template
};

