import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CustomAdv from './index';

export default {
  title: 'Design System/React UI/CustomAdv',
  component: CustomAdv
} as Meta<typeof CustomAdv>;

const template = (args) => (
  <div style={{width: 400}}>
    <CustomAdv {...args} />
  </div>
);

export const Base: StoryObj<CustomAdv> = {
  args: {
    position: 'BELOW_TOPBAR'
  },
  render: template
};
