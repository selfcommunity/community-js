import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import RelatedDiscussionSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/RelatedDiscussion',
  component: RelatedDiscussionSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof RelatedDiscussionSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RelatedDiscussionSkeleton> = (args) => (
  <div style={{width: 400}}>
    <RelatedDiscussionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
