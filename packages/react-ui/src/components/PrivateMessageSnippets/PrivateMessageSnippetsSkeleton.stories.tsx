import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageSnippetsSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageSnippets',
  component: PrivateMessageSnippetsSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageSnippetsSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageSnippetsSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetsSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
