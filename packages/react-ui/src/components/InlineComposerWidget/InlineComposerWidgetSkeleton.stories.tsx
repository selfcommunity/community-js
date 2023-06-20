import type { Meta, StoryObj } from '@storybook/react';
import InlineComposerWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Inline Composer Widget',
  component: InlineComposerWidgetSkeleton,
} as Meta<typeof InlineComposerWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <InlineComposerWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<InlineComposerWidgetSkeleton> = {
  render: template
};