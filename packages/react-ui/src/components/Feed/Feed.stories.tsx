import React, {useRef} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Feed, {FeedRef} from './Feed';
import {Endpoints} from '@selfcommunity/api-services';
import {SCNotificationTopicType} from '@selfcommunity/types';
import FeedObject, {FeedObjectSkeleton} from '../FeedObject';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import SCNotification, {NotificationSkeleton} from '../Notification';
import BroadcastMessages from '../BroadcastMessages';
import {CacheStrategies} from '@selfcommunity/utils';
import {
  CategoriesSuggestionWidget,
  InlineComposerWidget,
  CategoriesPopularWidget,
  UserSuggestionWidget,
  TrendingPeopleWidget,
  FeedUpdatesWidget,
} from '../../index';
import {exampleExploreData} from './prefetchedData';
import {Button} from '@mui/material';
import Icon from '@mui/material/Icon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Feed',
  component: Feed
} as ComponentMeta<typeof Feed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Feed> = (args) => {
  // REF
  const feedRef = useRef<FeedRef>();

  // HANDLERS
  const handleRefresh = () => {
    feedRef && feedRef.current && feedRef.current.refresh();
  };

  return (<div style={{width: '100%', marginTop: 30}}>
    <Button variant={'outlined'} color="info" style={{position: 'absolute', top: 16}} endIcon={<Icon fontSize={'small'} color="primary">cached</Icon>} onClick={handleRefresh}>Refresh</Button>
    <Feed {...args} ref={feedRef} />
  </div>);
};

const _WIDGETS = [
  {
    type: 'widget',
    component: TrendingPeopleWidget,
    componentProps: {categoryId: 1},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: CategoriesPopularWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: CategoriesSuggestionWidget,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: UserSuggestionWidget,
    componentProps: {},
    column: 'right',
    position: 6
  }
];

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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />
};


export const ExploreOffset20 = Template.bind({});

ExploreOffset20.args = {
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
  endpointQueryParams: {limit: 5, offset: 20},
  HeaderComponent: <InlineComposerWidget />
};

export const ExploreOffset20Cached = Template.bind({});

ExploreOffset20Cached.args = {
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
  endpointQueryParams: {limit: 5, offset: 20},
  cacheStrategy: CacheStrategies.CACHE_FIRST,
  HeaderComponent: <InlineComposerWidget />
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
  HeaderComponent: <InlineComposerWidget />,
  prefetchedData: exampleExploreData,
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
  HeaderComponent: <InlineComposerWidget />,
  cacheStrategy: CacheStrategies.CACHE_FIRST
};

export const ExploreWithoutVirtualization = Template.bind({});

ExploreWithoutVirtualization.args = {
  id: 'explore_no_virtualization',
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
  HeaderComponent: <InlineComposerWidget />,
  VirtualizedScrollerProps: {bypass: true}
};

export const Notification = Template.bind({});

Notification.args = {
  id: 'notifications_feed',
  endpoint: Endpoints.UserNotificationList,
  widgets: [
    {
      type: 'widget',
      component: FeedUpdatesWidget,
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
  requireAuthentication: true,
  disablePaginationLinks: true
};

export const NotificationCached = Template.bind({});

NotificationCached.args = {
  id: 'notifications_feed',
  endpoint: Endpoints.UserNotificationList,
  widgets: [
    {
      type: 'widget',
      component: FeedUpdatesWidget,
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
  requireAuthentication: true,
  disablePaginationLinks: true,
  cacheStrategy: CacheStrategies.CACHE_FIRST
};
