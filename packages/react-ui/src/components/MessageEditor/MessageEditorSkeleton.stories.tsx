import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import MessageEditorSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/MessageEditor',
  component: MessageEditorSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MessageEditorSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MessageEditorSkeleton> = (args) => (
  <div style={{width: 400}}>
    <MessageEditorSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
