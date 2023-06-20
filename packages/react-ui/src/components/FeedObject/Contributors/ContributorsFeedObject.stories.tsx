import type { Meta, StoryObj } from '@storybook/react';
import ContributorsFeedObject from './index';
import {SCContributionType} from '@selfcommunity/types';


export default {
  title: 'Design System/React UI/ContributorsFeedObject',
  component: ContributorsFeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 17}}
    },
    feedObjectType: {
      options: [SCContributionType.POST, SCContributionType.DISCUSSION, SCContributionType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  },
  args: {
    feedObjectId: 17,
    feedObjectType: SCContributionType.DISCUSSION
  }
  
} as Meta<typeof ContributorsFeedObject>;


const template: StoryObj<typeof ContributorsFeedObject> = (args) => (
  <div style={{width: 800}}>
    <ContributorsFeedObject {...args} />
  </div>
);

export const Preview = Template.bind({});

Preview.args = {};
