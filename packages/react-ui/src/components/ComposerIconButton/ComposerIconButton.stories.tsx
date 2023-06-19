import type { Meta, StoryObj } from '@storybook/react';
import ComposerIconButton from './index';

export default {
  title: 'Design System/React UI/Composer Icon Button',
  component: ComposerIconButton,
} as Meta<typeof ComposerIconButton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <ComposerIconButton {...args} />
  </div>
);

export const Base: StoryObj<ComposerIconButton> = {
  render: template
};
