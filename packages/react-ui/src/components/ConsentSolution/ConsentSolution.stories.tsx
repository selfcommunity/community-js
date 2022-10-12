import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ConsentSolution from './ConsentSolution';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

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
  legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
};

export const Privacy = Template.bind({});

Privacy.args = {
  legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
};
