import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UsernameTextField from './index';

export default {
  title: 'Design System/React UI Shared/Username Textfield',
  component: UsernameTextField,
} as ComponentMeta<typeof UsernameTextField>;

const Template: ComponentStory<typeof UsernameTextField> = (args) => <UsernameTextField {...args} />;

export const Base = Template.bind({});

Base.args = {};

export const BaseLabel = Template.bind({});

BaseLabel.args = {
  label: 'Label'
};

export const BaseLabelValue = Template.bind({});

BaseLabelValue.args = {
  label: 'Label',
  value: 'value'
};
