import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjectDetailTemplate from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Feed Object Detail',
  component: FeedObjectDetailTemplate
} as ComponentMeta<typeof FeedObjectDetailTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjectDetailTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  feedObjectId: 360,
  feedObjectType: SCFeedObjectTypologyType.POST
};

export const BaseCacheSWR = Template.bind({});

BaseCacheSWR.args = {
  feedObjectId: 360,
  feedObjectType: SCFeedObjectTypologyType.POST,
  FeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE},
  CommentsFeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE}
};

export const CommentFirstLevel = Template.bind({});

CommentFirstLevel.args = {
  feedObjectId: 360,
  feedObjectType: SCFeedObjectTypologyType.POST,
  CommentsFeedObjectProps: {commentObjectId: 1145}
};

export const CommentSecondLevel = Template.bind({});

CommentSecondLevel.args = {
  feedObjectId: 412,
  feedObjectType: SCFeedObjectTypologyType.POST,
  CommentsFeedObjectProps: {commentObjectId: 1205}
};
