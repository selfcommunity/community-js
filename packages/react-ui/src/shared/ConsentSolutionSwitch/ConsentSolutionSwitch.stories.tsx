import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ConsentSolutionSwitch, { ConsentSolutionSwitchProps } from './index';

export default {
  title: 'Design System/React UI Shared/ConsentSolutionSwitch',
  component: ConsentSolutionSwitch
} as Meta<typeof ConsentSolutionSwitch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const template = (args: ConsentSolutionSwitchProps) => <ConsentSolutionSwitch {...args} />;

export const Base: StoryObj<typeof ConsentSolutionSwitch> = {
  render: template
};

export const Loading: StoryObj<typeof ConsentSolutionSwitch> = {
  args: {
    loading: true
  },
  render: template
};
