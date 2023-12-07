import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {
  BroadcastMessages,
  CategoriesSuggestionWidget,
  Feed,
  SCFeedObjectTemplateType,
  FeedSidebarProps,
  FeedProps,
  FeedUpdatesWidget,
  LoyaltyProgramWidget,
  Notification,
  NotificationProps,
  NotificationSkeleton,
  UserSuggestionWidget,
  PlatformWidget,
  SCFeedWidgetType,
  getUnseenNotificationCounter
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {SCNotificationTopicType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface NotificationFeedProps {
  /**
   * Id of the feed object
   * @default 'notification_feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Widgets to be rendered into the feed
   * @default [CategoriesFollowed, UserFollowed]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  NotificationProps?: NotificationProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to feed component
   * @default {}
   */
  FeedProps?: Omit<
    FeedProps,
    'endpoint' | 'widgets' | 'ItemComponent' | 'itemPropsGenerator' | 'itemIdGenerator' | 'ItemSkeleton' | 'ItemSkeletonProps' | 'FeedSidebarProps'
  >;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: FeedUpdatesWidget,
    componentProps: {subscriptionChannel: SCNotificationTopicType.INTERACTION, publicationChannel: 'notifications_feed'},
    column: 'left',
    position: 0,
    publishEvents: true
  },
  {
    type: 'widget',
    component: BroadcastMessages,
    componentProps: {subscriptionChannel: 'notification_feed'},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: PlatformWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: LoyaltyProgramWidget,
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
    position: 3
  }
];

/**
 * > API documentation for the Community-JS Notification Feed Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders the template for the notification feed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/NotificationFeed)

 #### Import

 ```jsx
 import {NotificationFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCNotificationFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNotificationFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function NotificationFeed(inProps: NotificationFeedProps): JSX.Element {
  // PROPS
  const props: NotificationFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'notification_feed', className, widgets = WIDGETS, NotificationProps = {}, FeedSidebarProps = null, FeedProps = {}} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // Ckeck user is authenticated
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Update user unseen notification counter
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const handleFetchData = (page: number, offset: number, total: number, data: any[]) => {
    let _unviewed = getUnseenNotificationCounter(data);
    _unviewed > 0 && scUserContext.setUnseenInteractionsCounter(scUserContext.user.unseen_interactions_counter - _unviewed);
    if (!_unviewed) {
      // Sync counters
      void scUserContext.refreshCounters();
    }
  };

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      endpoint={Endpoints.UserNotificationList}
      widgets={widgets}
      ItemComponent={Notification}
      itemPropsGenerator={(scUser, item) => ({
        notificationObject: item
      })}
      itemIdGenerator={(item) => item.sid}
      ItemProps={NotificationProps}
      ItemSkeleton={NotificationSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
      requireAuthentication={true}
      disablePaginationLinks={true}
      onNextData={handleFetchData}
      onPreviousData={handleFetchData}
      {...FeedProps}
    />
  );
}
