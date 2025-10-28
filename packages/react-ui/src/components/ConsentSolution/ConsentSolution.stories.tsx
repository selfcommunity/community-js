import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ConsentSolution, { ConsentSolutionProps } from './ConsentSolution';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/ConsentSolution',
  component: ConsentSolution,
  argTypes: {},
  args: {}
} as Meta<typeof ConsentSolution>;

const template = (args: ConsentSolutionProps) => (
  <div style={{width: 600}}>
    <ConsentSolution {...args} />
  </div>
);

export const Base: StoryObj<typeof ConsentSolution> = {
  args: {
    contained: true
  },
  render: template
};

export const Tec: StoryObj<typeof ConsentSolution> = {
  args: {
    legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
  },
  render: template
};

export const Privacy: StoryObj<typeof ConsentSolution> = {
  args: {
    legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
  },
  render: template
};