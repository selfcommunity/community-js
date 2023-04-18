import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import InlineComposerWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Inline Composer Widget',
  component: InlineComposerWidgetSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof InlineComposerWidgetSkeleton>;

const Template: ComponentStory<typeof InlineComposerWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <InlineComposerWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
