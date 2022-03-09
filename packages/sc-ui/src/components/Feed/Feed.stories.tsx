import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Feed from './index';
import {Endpoints, SCNotificationTopicType} from '@selfcommunity/core';
import FeedObject, {FeedObjectSkeleton} from '../FeedObject';
import {FeedObjectTemplateType} from '../../types/feedObject';
import SCNotification, {NotificationSkeleton} from '../Notification';
import FeedUpdates from '../FeedUpdates';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Feed',
  component: Feed
} as ComponentMeta<typeof Feed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Feed> = (args) => (
  <div style={{width: '100%', height: '500px'}}>
    <Feed {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  endpoint: Endpoints.MainFeed,
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
    template: FeedObjectTemplateType.PREVIEW
  }
};

export const Explore = Template.bind({});

Explore.args = {
  endpoint: Endpoints.ExploreFeed,
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
    template: FeedObjectTemplateType.PREVIEW
  }
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
    }
  ],
  ItemComponent: SCNotification,
  itemPropsGenerator: (scUser, item) => ({
    notificationObject: item
  }),
  itemIdGenerator: (item) => item.sid,
  ItemSkeleton: NotificationSkeleton
};
