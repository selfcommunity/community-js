import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Bullet from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SHARED COMPONENT/Bullet',
  component: Bullet
} as ComponentMeta<typeof Bullet>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Bullet> = (args) => <Bullet {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
