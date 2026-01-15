import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BaseLightbox, { BaseLightboxProps } from './index';

export default {
  title: 'Design System/React UI Shared/BaseLightbox',
  component: BaseLightbox,
  argTypes: {}
} as Meta<typeof BaseLightbox>;

const template = ({images, ...rest}: BaseLightboxProps) => <BaseLightbox images={[{ key: '1', src: 'https://images.pexels.com/photos/7001554/pexels-photo-7001554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }, { key: '2', src: 'https://images.pexels.com/photos/15392584/pexels-photo-15392584/free-photo-of-mare-bianco-e-nero-navigando-nave.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }]} {...rest} />;

export const Base: StoryObj<typeof BaseLightbox> = {
  args: {},
  render: template
};
