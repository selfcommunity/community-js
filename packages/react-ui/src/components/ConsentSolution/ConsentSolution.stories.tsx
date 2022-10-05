import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolution from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ConsentSolution',
  component: ConsentSolution,
} as ComponentMeta<typeof ConsentSolution>;

const Template: ComponentStory<typeof ConsentSolution> = (args) => (
  <div style={{width: 800}}>
    <ConsentSolution {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
