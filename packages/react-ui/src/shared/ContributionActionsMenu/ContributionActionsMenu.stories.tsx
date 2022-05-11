import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import ContributionActionsMenu from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';

export default {
  title: 'Design System/SHARED COMPONENT/ContributionActionsMenu',
  component: ContributionActionsMenu,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 379}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  },
  args: {
    feedObjectId: 379, // 9,
    feedObjectType: SCFeedObjectTypologyType.POST
  }
} as ComponentMeta<typeof ContributionActionsMenu>;

const Template: ComponentStory<typeof ContributionActionsMenu> = (args) => <ContributionActionsMenu {...args} />;

export const Base = Template.bind({});

Base.args = {};
