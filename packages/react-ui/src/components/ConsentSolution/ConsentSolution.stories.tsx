import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolution from './ConsentSolution';
import { LEGAL_POLICY_PRIVACY, LEGAL_POLICY_TEC } from "../../constants/LegalPages";

export default {
  title: 'Design System/React UI/ConsentSolution',
  component: ConsentSolution,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof ConsentSolution>;

const Template: ComponentStory<typeof ConsentSolution> = (args) => (
  <div style={{width: 600}}>
    <ConsentSolution {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};

export const Tec = Template.bind({});

Tec.args = {
  legalPolicies: [LEGAL_POLICY_TEC]
};

export const Privacy = Template.bind({});

Privacy.args = {
  legalPolicies: [LEGAL_POLICY_PRIVACY]
};
