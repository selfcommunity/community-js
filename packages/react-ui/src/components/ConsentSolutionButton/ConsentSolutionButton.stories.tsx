import type { Meta, StoryObj } from '@storybook/react';
import ConsentSolutionButton from './index';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/ConsentSolution Button',
  component: ConsentSolutionButton,
} as Meta<typeof ConsentSolutionButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <ConsentSolutionButton {...args} />
  </div>
);

export const Tec: StoryObj<ConsentSolutionButton> = {
  args: {
    ConsentSolutionProps: {
      legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
    }
  },
  render: template
};

export const Privacy: StoryObj<ConsentSolutionButton> = {
  args: {
    ConsentSolutionProps: {
      legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
    }
  },
  render: template
};