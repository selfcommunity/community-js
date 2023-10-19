import type { Meta, StoryObj } from '@storybook/react';
import Composer, { ComposerProps } from './index';

export default {
  title: 'Design System/React UI /Composer',
  component: Composer
} as Meta<typeof Composer>;

const template = (args) => (
  <div style={{maxWidth: 400}}>
    <Composer {...args} />
  </div>
);

export const Base: StoryObj<ComposerProps> = {
  args: {
    /* the args you need here will depend on your component */
    maxWidth: 'sm',
    fullWidth: true,
    scroll: 'body',
    open: false
  },
  render: template
};

