import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjsListSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/FeedObjs List',
  component: FeedObjsListSkeleton
} as ComponentMeta<typeof FeedObjsListSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjsListSkeleton> = (args) => (
  <div style={{width: 400}}>
    <FeedObjsListSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
