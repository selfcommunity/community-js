import type { Meta, StoryObj } from '@storybook/react';
import OnBoardingWidget from './index';
import React from 'react';

export default {
  title: 'Design System/React UI/OnBoardingWidget ',
  component: OnBoardingWidget
} as Meta<typeof OnBoardingWidget>;

const template = (args) => (
  // <div style={{width: 600, height: 413}}>
    <OnBoardingWidget open={true} {...args} />
  // </div>
);

export const Base: StoryObj<OnBoardingWidget> = {
  args: {},
  render: template
};

