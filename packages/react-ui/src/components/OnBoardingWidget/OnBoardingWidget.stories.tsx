import type { Meta, StoryObj } from '@storybook/react-webpack5';
import OnBoardingWidget, { OnBoardingWidgetProps } from './index';

export default {
  title: 'Design System/React UI/OnBoardingWidget ',
  component: OnBoardingWidget
} as Meta<typeof OnBoardingWidget>;

const template = (args: OnBoardingWidgetProps) => (
  // <div style={{width: 600, height: 413}}>
    <OnBoardingWidget {...args} />
  // </div>
);

export const Base: StoryObj<typeof OnBoardingWidget> = {
  args: {
    GenerateContentsParams: {
      //force: 1,
      //num_posts: 5,
      num_images: 0
    },
  },
  render: template
};

