import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolutionButton from './index';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ConsentSolution Button',
  component: ConsentSolutionButton,
} as ComponentMeta<typeof ConsentSolutionButton>;

const Template: ComponentStory<typeof ConsentSolutionButton> = (args) => (
  <div style={{width: 800}}>
    <ConsentSolutionButton {...args} />
  </div>
);

export const Tec = Template.bind({});

Tec.args = {
  ConsentSolutionProps: {
    legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
  }
};

export const Privacy = Template.bind({});

Privacy.args = {
  ConsentSolutionProps: {
    legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
  }
};
