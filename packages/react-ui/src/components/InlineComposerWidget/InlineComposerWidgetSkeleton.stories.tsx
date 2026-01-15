import type { Meta, StoryObj } from '@storybook/react-webpack5';
import InlineComposerWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI /Skeleton/Inline Composer Widget',
  component: InlineComposerWidgetSkeleton,
} as Meta<typeof InlineComposerWidgetSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <InlineComposerWidgetSkeleton />
  </div>
);

export const Base: StoryObj<typeof InlineComposerWidgetSkeleton> = {
  render: template
};