import type { Meta, StoryObj } from '@storybook/react';
import FeedObjectDetailTemplate from './index';
import { CacheStrategies } from '@selfcommunity/utils';
import { SCContributionType } from '@selfcommunity/types';

export default {
  title: 'Design System/React TEMPLATES/Feed Object Detail',
  component: FeedObjectDetailTemplate
} as Meta<typeof FeedObjectDetailTemplate>;

const template = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailTemplate {...args} />
  </div>);

export const Base: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 1400,
    feedObjectType: SCContributionType.DISCUSSION
  },
  render: template
};

export const BaseCacheSWR: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 360,
    feedObjectType: SCContributionType.POST,
    FeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE},
    CommentsFeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE}
  },
  render: template
};

export const BasePagination: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 360,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {page: 3}
  },
  render: template
};

export const CommentFirstLevel: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 360,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {commentObjectId: 1145}
  },
  render: template
};

export const CommentSecondLevel: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 412,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {commentObjectId: 1205}
  },
  render: template
};
