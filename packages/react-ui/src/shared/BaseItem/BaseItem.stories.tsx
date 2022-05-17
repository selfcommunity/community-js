import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import BaseItem from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI Shared/BaseItem',
  component: BaseItem
} as ComponentMeta<typeof BaseItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseItem> = (args) => <BaseItem {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  primary: 'TITOLO',
  secondary: 'caption'
};
