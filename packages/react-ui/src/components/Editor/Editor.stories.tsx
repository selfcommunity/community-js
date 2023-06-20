import type { Meta, StoryObj } from '@storybook/react';
import Editor from './index';

export default {
  title: 'Design System/React UI/Editor',
  component: Editor
} as Meta<typeof Editor>;

const template = (args) => (
  <div style={{width: 400}}>
    <Editor {...args} />
  </div>
);

export const Base: StoryObj<Editor> = {
  args: {
    defaultValue: '<p><s>ciao</s> <mention id="1" ext-id="5">@username</mention></p>',
    onChange: (value) => console.log(value),
    toolbar: false,
    uploadImage: false
  },
  render: template
};
