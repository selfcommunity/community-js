import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {
  BroadcastMessages,
  CategoriesSuggestion,
  Feed,
  FeedObjectTemplateType,
  FeedSidebarProps,
  FeedUpdates,
  LoyaltyProgram,
  Notification,
  NotificationProps,
  NotificationSkeleton,
  PeopleSuggestion,
  Platform,
  SCFeedWidgetType
} from '@selfcommunity/ui';
import {Endpoints, SCNotificationTopicType, SCUserContext, SCUserContextType} from '@selfcommunity/core';

const PREFIX = 'SCNotificationFeedTemplate';

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

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
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: BroadcastMessages,
    componentProps: {},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: FeedUpdates,
    componentProps: {subscriptionChannel: SCNotificationTopicType.INTERACTION},
    column: 'left',
    position: 1,
    publishEvents: true
  },
  {
    type: 'widget',
    component: Platform,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: LoyaltyProgram,
    componentProps: {},
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
    position: 3
  }
];

export default function NotificationFeed(props: NotificationFeedProps): JSX.Element {
  // PROPS
  const {id = 'notification_feed', className, widgets = WIDGETS, NotificationProps = {}, FeedSidebarProps = null} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // Ckeck user is authenticated
  if (!scUserContext.user) {
    return null;
  }

  return (
    <Root
      id={id}
      className={className}
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
        template: FeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
    />
  );
}
