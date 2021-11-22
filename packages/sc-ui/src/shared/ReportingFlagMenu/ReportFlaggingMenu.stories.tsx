import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ReportingFlagMenu from './index';
import { SCFeedObjectTypologyType } from '@selfcommunity/core';

export default {
  title: 'Design System/SHARED COMPONENT/ReportingFlagMenu',
  component: ReportingFlagMenu,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      defaultValue: 7604,
      table: {defaultValue: {summary: 7604}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  }
} as ComponentMeta<typeof ReportingFlagMenu>;

const Template: ComponentStory<typeof ReportingFlagMenu> = (args) => <ReportingFlagMenu {...args} />;

export const Base = Template.bind({});

Base.args = {};
