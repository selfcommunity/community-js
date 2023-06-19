import type { Meta, StoryObj } from '@storybook/react';
import ConsentSolutionSwitch from './index';

export default {
  title: 'Design System/React UI Shared/ConsentSolutionSwitch',
  component: ConsentSolutionSwitch
} as Meta<typeof ConsentSolutionSwitch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const template = (args) => <ConsentSolutionSwitch {...args} />;

export const Base: StoryObj<ConsentSolutionSwitch> = {
  render: template
};

export const Loading: StoryObj<ConsentSolutionSwitch> = {
  args: {
    loading: true
  },
  render: template
};
