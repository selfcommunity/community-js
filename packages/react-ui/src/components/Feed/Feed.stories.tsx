import {useRef} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
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
	FeedUpdatesWidget
} from '../../index';
import {exampleExploreData} from './prefetchedData';
import {Button} from '@mui/material';

export default {
	title: 'Design System/React UI/Feed',
	component: Feed
} as Meta<typeof Feed>;

/**
 * General template structure
 * @param args
 */
const template = (args) => {
	// REF
	const feedRef = useRef<FeedRef>();

	// HANDLERS
	const handleRefresh = () => {
		feedRef && feedRef.current && feedRef.current.refresh();
	};

	return (<div style={{width: '100%', marginTop: 30}}>
		<Button color='info' variant='contained' size='small' style={{position: 'absolute', top: 19, left: 25}}
						onClick={handleRefresh}>Refresh</Button>
		<Feed {...args} ref={feedRef} />
	</div>);
};

/**
 * General template FIXED structure
 * @param args
 */
const templateContainerFixed = (args) => {
	// REF
	const feedRef = useRef<FeedRef>();

	// HANDLERS
	const handleRefresh = () => {
		feedRef && feedRef.current && feedRef.current.refresh();
	};

	return (<div>
		<Button id={'testButton'} color='info' variant='contained' size='small' style={{position: 'absolute', top: 20, left: 25}}
						onClick={handleRefresh}>Refresh</Button>
		<div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1000, maxWidth: '100% !important', height: '100vh', overflow: 'auto'}} id="scrollableDiv">
			<Feed {...args} ref={feedRef} InfiniteScrollComponentProps={{scrollableTarget: 'scrollableDiv'}} />
		</div>
	</div>);
};

const _WIDGETS = [
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

export const Main: StoryObj<Feed> = {
	args: {
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
	},
	render: template
};

export const MainCache: StoryObj<Feed> = {
	args: {
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
	},
	render: template
};

export const Explore: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreContainerFixed: StoryObj<typeof Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: templateContainerFixed
};

export const ExploreCache: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset2: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset2Cached: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset5: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset5Cached: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset20: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExploreOffset20Cached: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		HeaderComponent: <InlineComposerWidget />
	},
	render: template
};

export const ExplorePrefetchedData: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		prefetchedData: exampleExploreData
	},
	render: template
};

export const ExplorePrefetchedDataCached: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		cacheStrategy: CacheStrategies.CACHE_FIRST
	},
	render: template
};

export const ExploreWithoutVirtualization: StoryObj<Feed> = {
	args: {
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
		requireAuthentication: true,
		VirtualizedScrollerProps: {bypass: true}
	},
	render: template
};

export const Notification: StoryObj<Feed> = {
	args: {
		id: 'notifications_feed',
		endpoint: Endpoints.UserNotificationList,
		widgets: [
			{
				type: 'widget',
				component: FeedUpdatesWidget,
				componentProps: {
					variant: 'outlined',
					subscriptionChannel: SCNotificationTopicType.INTERACTION,
					publicationChannel: 'notifications_feed'
				},
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
	},
	render: template
};

export const NotificationCached: StoryObj<Feed> = {
	args: {
		id: 'notifications_feed',
		endpoint: Endpoints.UserNotificationList,
		widgets: [
			{
				type: 'widget',
				component: FeedUpdatesWidget,
				componentProps: {
					variant: 'outlined',
					subscriptionChannel: SCNotificationTopicType.INTERACTION,
					publicationChannel: 'notifications_feed'
				},
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
	},
	render: template
};
