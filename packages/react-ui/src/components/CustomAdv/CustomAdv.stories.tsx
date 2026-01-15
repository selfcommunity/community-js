import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CustomAdv, { CustomAdvProps } from './index';
import { SCCustomAdvPosition } from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/CustomAdv',
  component: CustomAdv
} as Meta<typeof CustomAdv>;

const template = (args: CustomAdvProps) => (
  <div style={{width: 400}}>
    <CustomAdv {...args} />
  </div>
);

export const Base: StoryObj<typeof CustomAdv> = {
  args: {
    position: SCCustomAdvPosition.POSITION_BELOW_TOPBAR
  },
  render: template
};
