import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import GenericSkeleton from './GenericSkeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/Generic',
  component: GenericSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof GenericSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GenericSkeleton> = (args) => (
  <div style={{width: 400}}>
    <GenericSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
