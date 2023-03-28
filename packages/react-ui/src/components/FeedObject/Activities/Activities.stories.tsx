import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Activities from './index';
import {SCContributionType} from '@selfcommunity/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
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
} as ComponentMeta<typeof Activities>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Activities> = (args) => {
  return (<div style={{width: '100%', maxWidth: 800}}>
    <Activities {...args} />
  </div>);
};

export const Base = Template.bind({});

Base.args = {
  feedObjectId: 327,
  feedObjectType: SCContributionType.POST
};

