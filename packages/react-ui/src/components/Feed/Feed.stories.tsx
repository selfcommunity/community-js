import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Feed from './Feed';
import {Endpoints} from '@selfcommunity/api-services';
import {SCNotificationTopicType} from '@selfcommunity/types';
import FeedObject, {FeedObjectSkeleton} from '../FeedObject';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import SCNotification, {NotificationSkeleton} from '../Notification';
import FeedUpdates from '../FeedUpdates';
import BroadcastMessages from '../BroadcastMessages';
import {CacheStrategies} from '@selfcommunity/utils';
import {InlineComposer, TrendingPeople} from '../../index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Feed',
  component: Feed
} as ComponentMeta<typeof Feed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Feed> = (args) => {
  return (<div style={{width: '100%', height: '500px', marginTop: 30}}>
    <Feed {...args} />
  </div>);
};

export const Main = Template.bind({});

Main.args = {
  id: 'main',
  endpoint: Endpoints.MainFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  requireAuthentication: true
};

export const MainCache = Template.bind({});

MainCache.args = {
  id: 'main',
  endpoint: Endpoints.MainFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  requireAuthentication: true,
  cacheStrategy: CacheStrategies.CACHE_FIRST
};


export const Explore = Template.bind({});

Explore.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  cacheStrategy: CacheStrategies.NETWORK_ONLY
};

export const ExploreCache = Template.bind({});

ExploreCache.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  cacheStrategy: CacheStrategies.CACHE_FIRST
};

export const ExploreOffset2 = Template.bind({});

ExploreOffset2.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  endpointQueryParams: {limit: 5, offset: 2}
};

export const ExploreOffset2Cached = Template.bind({});

ExploreOffset2Cached.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: [
    {
      type: 'widget',
      component: TrendingPeople,
      componentProps: {categoryId: 1},
      column: 'right',
      position: 1
    }
  ],
  ItemComponent: FeedObject,
  itemPropsGenerator: (scUser, item) => ({
    feedObject: item[item.type],
    feedObjectType: item.type,
    feedObjectActivities: item.activities ? item.activities : null,
    markRead: scUser ? !item.seen_by_id.includes(scUser.id) : false
  }),
  itemIdGenerator: (item) => item[item.type].id,
  ItemSkeleton: FeedObjectSkeleton,
  ItemSkeletonProps: {
    template: SCFeedObjectTemplateType.PREVIEW
  },
  endpointQueryParams: {limit: 5, offset: 2},
  cacheStrategy: CacheStrategies.CACHE_FIRST
};


export const Notification = Template.bind({});

Notification.args = {
  id: 'notifications_feed',
  endpoint: Endpoints.UserNotificationList,
  widgets: [
    {
      type: 'widget',
      component: FeedUpdates,
      componentProps: {variant: 'outlined', subscriptionChannel: SCNotificationTopicType.INTERACTION, publicationChannel: 'notifications_feed'},
      column: 'left',
      position: 0
    },
    {
      type: 'widget',
      component: BroadcastMessages,
      componentProps: {variant: 'outlined', subscriptionChannel: `notifications_feed`},
      column: 'left',
      position: 0
    }
  ],
  ItemComponent: SCNotification,
  itemPropsGenerator: (scUser, item) => ({
    notificationObject: item
  }),
  itemIdGenerator: (item) => item.sid,
  ItemSkeleton: NotificationSkeleton,
  requireAuthentication: true
};
