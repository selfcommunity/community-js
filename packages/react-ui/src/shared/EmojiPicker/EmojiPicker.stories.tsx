import {ComponentStory, ComponentMeta} from '@storybook/react';
import EmojiPicker from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI Shared/EmojiPicker',
  component: EmojiPicker
} as ComponentMeta<typeof EmojiPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmojiPicker> = (args) => <EmojiPicker {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
