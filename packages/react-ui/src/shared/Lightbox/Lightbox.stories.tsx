import type { Meta, StoryObj } from '@storybook/react';
import Lightbox from './index';

export default {
  title: 'Design System/React UI Shared/Lightbox',
  component: Lightbox,
  argTypes: {}
} as Meta<typeof Lightbox>;

const template = (args) => <Lightbox images={[{key: '1', src: 'https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}, {key: '2', src: 'https://images.pexels.com/photos/15392584/pexels-photo-15392584/free-photo-of-mare-bianco-e-nero-navigando-nave.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}]} {...args} />;

export const Base: StoryObj<typeof Lightbox> = {
  args: {},
  render: template
};
