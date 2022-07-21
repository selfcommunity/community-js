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
import {CategoriesSuggestion, InlineComposer, PeopleSuggestion, TrendingPeople} from '../../index';
import {exampleExploreData} from './prefetchedData';

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

const _WIDGETS = [{
  type: 'widget',
  component: TrendingPeople,
  componentProps: {categoryId: 1},
  column: 'right',
  position: 1
},
  {
    type: 'widget',
    component: CategoriesSuggestion,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: PeopleSuggestion,
    componentProps: {},
    column: 'right',
    position: 6
  }];

export const Main = Template.bind({});

Main.args = {
  id: 'main',
  endpoint: Endpoints.MainFeed,
  widgets: _WIDGETS,
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
  HeaderComponent: <InlineComposer />
};

export const MainCache = Template.bind({});

MainCache.args = {
  id: 'main',
  endpoint: Endpoints.MainFeed,
  widgets: _WIDGETS,
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
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposer />
};


export const Explore = Template.bind({});

Explore.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  cacheStrategy: CacheStrategies.NETWORK_ONLY,
  HeaderComponent: <InlineComposer />
};

export const ExploreCache = Template.bind({});

ExploreCache.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposer />
};

export const ExploreOffset2 = Template.bind({});

ExploreOffset2.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  HeaderComponent: <InlineComposer />
};


export const ExploreOffset2Cached = Template.bind({});

ExploreOffset2Cached.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposer />
};

export const ExploreOffset5 = Template.bind({});

ExploreOffset5.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5, offset: 5},
  HeaderComponent: <InlineComposer />
};

export const ExploreOffset5Cached = Template.bind({});

ExploreOffset5Cached.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5, offset: 5},
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposer />
};


export const ExploreOffset10 = Template.bind({});

ExploreOffset10.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5, offset: 10},
  HeaderComponent: <InlineComposer />
};

export const ExploreOffset10Cached = Template.bind({});

ExploreOffset10Cached.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5, offset: 10},
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposer />
};

export const ExplorePrefetchedData = Template.bind({});

ExplorePrefetchedData.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5},
  prefetchedData: exampleExploreData
};

export const ExplorePrefetchedDataCached = Template.bind({});

ExplorePrefetchedDataCached.args = {
  id: 'explore',
  endpoint: Endpoints.ExploreFeed,
  widgets: _WIDGETS,
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
  endpointQueryParams: {limit: 5},
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
