import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ChangeGroupPicture, { ChangeGroupPictureProps } from './index';

export default {
  title: 'Design System/React UI/ChangeGroupPicture',
  component: ChangeGroupPicture
} as Meta<typeof ChangeGroupPicture>;

const template = (args: ChangeGroupPictureProps) => (
  <div style={{width: 400}}>
    <ChangeGroupPicture {...args} />
  </div>
);

export const Base: StoryObj<typeof ChangeGroupPicture> = {
  render: template
};
