import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageSnippetItemSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItemSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageSnippetItemSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageSnippetItemSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItemSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
