import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CreateLiveStreamDialog, { CreateLiveStreamDialogProps } from './index';

export default {
  title: 'Design System/React UI/Livestream/CreateLiveStreamDialog ',
  component: CreateLiveStreamDialog,
} as Meta<typeof CreateLiveStreamDialog>;

const template = (args: CreateLiveStreamDialogProps) => (
  <div style={{width: 800}}>
    <CreateLiveStreamDialog{...args} />
  </div>
);


export const Base: StoryObj<typeof CreateLiveStreamDialog> = {
  args: {},
  render: template
};
