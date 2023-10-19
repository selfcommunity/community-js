import type { Meta, StoryObj } from '@storybook/react';
import InlineComposerWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI Unstable/Skeleton/Inline Composer Widget',
  component: InlineComposerWidgetSkeleton,
} as Meta<typeof InlineComposerWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <InlineComposerWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof InlineComposerWidgetSkeleton> = {
  render: template
};