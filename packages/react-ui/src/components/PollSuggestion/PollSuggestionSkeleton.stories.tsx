import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PollSuggestionSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/PollSuggestion',
  component: PollSuggestionSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PollSuggestionSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PollSuggestionSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PollSuggestionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
