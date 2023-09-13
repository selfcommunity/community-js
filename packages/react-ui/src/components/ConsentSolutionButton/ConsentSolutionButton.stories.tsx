import type { Meta, StoryObj } from '@storybook/react';
import ConsentSolutionButton, {ConsentSolutionButtonProps} from './index';
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

export const Tec: StoryObj<ConsentSolutionButtonProps> = {
  args: {
    ConsentSolutionProps: {
      legalPolicies: [SCLegalPagePoliciesType.TERMS_AND_CONDITIONS]
    }
  },
  render: template
};

export const Privacy: StoryObj<ConsentSolutionButtonProps> = {
  args: {
    ConsentSolutionProps: {
      legalPolicies: [SCLegalPagePoliciesType.PRIVACY]
    }
  },
  render: template
};