import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolutionSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/ConsentSolution',
  component: ConsentSolutionSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof ConsentSolutionSkeleton>;

const Template: ComponentStory<typeof ConsentSolutionSkeleton> = (args) => (
  <div style={{width: 600}}>
    <ConsentSolutionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
