import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LiveStreamSelector, { LiveStreamSelectorProps } from './LiveStreamSelector';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamSelector ',
  component: LiveStreamSelector,
} as Meta<typeof LiveStreamSelector>;

const template = (args: LiveStreamSelectorProps) => (
  <div style={{width: 800}}>
    <LiveStreamSelector {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamSelector> = {
  args: {},
  render: template
};
