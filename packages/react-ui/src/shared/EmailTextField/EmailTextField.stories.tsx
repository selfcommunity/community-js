import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import EmailTextField from './index';

export default {
  title: 'Design System/React UI Shared/Email Textfield',
  component: EmailTextField,
} as ComponentMeta<typeof EmailTextField>;

const Template: ComponentStory<typeof EmailTextField> = (args) => <EmailTextField {...args} />;

export const Base = Template.bind({});

Base.args = {};

export const BaseLabel = Template.bind({});

BaseLabel.args = {
  label: 'Label',
  name: 'email',
  id: 'email'
};