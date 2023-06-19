import type { Meta, StoryObj } from '@storybook/react';
import ConsentSolution from './ConsentSolution';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/ConsentSolution',
  component: ConsentSolution,
  argTypes: {},
  args: {}
} as Meta<typeof ConsentSolution>;

const template = (args) => (
  <div style={{width: 600}}>
    <ConsentSolution {...args} />
  </div>
);

export const Base: StoryObj<ConsentSolution> = {
  args: {
    contained: true
  },
  render: template
};

export const Tec: StoryObj<ConsentSolution> = {
  args: {
    legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
  },
  render: template
};

export const Privacy: StoryObj<ConsentSolution> = {
  args: {
    legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
  },
  render: template
};