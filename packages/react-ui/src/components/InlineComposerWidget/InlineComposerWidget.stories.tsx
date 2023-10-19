import type { Meta, StoryObj } from '@storybook/react';
import InlineComposerWidget, { InlineComposerWidgetProps } from './index';

export default {
  title: 'Design System/React UI /Inline Composer Widget',
  component: InlineComposerWidget
} as Meta<typeof InlineComposerWidget>;

const template = (args) => (
  <div style={{maxWidth: 500}}>
    <InlineComposerWidget {...args} />
  </div>
);

export const Base: StoryObj<InlineComposerWidgetProps> = {
  render: template
};