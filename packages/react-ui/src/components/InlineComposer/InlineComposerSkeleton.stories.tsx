import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import InlineComposerSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Inline Composer',
  component: InlineComposerSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof InlineComposerSkeleton>;

const Template: ComponentStory<typeof InlineComposerSkeleton> = (args) => (
  <div style={{width: 400}}>
    <InlineComposerSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
