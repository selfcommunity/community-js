import type { Meta, StoryObj } from '@storybook/react';

import Activities from './index';
import {SCContributionType} from '@selfcommunity/types';


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
} as Meta<typeof Activities>;


const template: StoryObj<typeof Activities> = (args) => {
  return (<div style={{width: '100%', maxWidth: 800}}>
    <Activities {...args} />
  </div>);
};



Base.args = {
  feedObjectId: 327,
  feedObjectType: SCContributionType.POST
};

