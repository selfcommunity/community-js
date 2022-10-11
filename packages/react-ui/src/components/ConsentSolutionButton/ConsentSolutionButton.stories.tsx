import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolutionButton from './index';
import { LEGAL_POLICY_TEC, LEGAL_POLICY_PRIVACY } from "../../constants/LegalPages";

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
    legalPolicies: [LEGAL_POLICY_TEC]
  }
};

export const Privacy = Template.bind({});

Privacy.args = {
  ConsentSolutionProps: {
    legalPolicies: [LEGAL_POLICY_PRIVACY]
  }
};
