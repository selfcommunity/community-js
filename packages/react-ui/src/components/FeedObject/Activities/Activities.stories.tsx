import type { Meta, StoryObj } from '@storybook/react';

import Activities, { ActivitiesProps } from './index';
import { SCContributionType } from '@selfcommunity/types';


export default {
  title: 'Design System/React UI/FeedObject/Activities',
  component: Activities,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 9}}
    },
    feedObjectType: {
      options: [SCContributionType.POST, SCContributionType.DISCUSSION, SCContributionType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  }
} as Meta<ActivitiesProps>;


const template = (args) => {
  return (<div style={{width: '100%', maxWidth: 800}}>
    <Activities {...args} />
  </div>);
};


export const Base: StoryObj<ActivitiesProps> = {
  args: {
    feedObjectId: 327,
    feedObjectType: SCContributionType.POST
  },
  render: template
};

