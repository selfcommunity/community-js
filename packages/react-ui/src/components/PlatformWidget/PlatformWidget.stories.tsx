import type { Meta, StoryObj } from '@storybook/react';
import PlatformWidget from './index';

export default {
  title: 'Design System/React UI/PlatformWidget ',
  component: PlatformWidget
} as Meta<typeof PlatformWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <PlatformWidget {...args} />
  </div>
);

export const Base: StoryObj<PlatformWidget> = {
  args: {
    contained: true,
  },
  render: template
};