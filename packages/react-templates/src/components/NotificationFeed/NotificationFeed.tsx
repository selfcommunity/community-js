import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {
  BroadcastMessages,
  CategoriesSuggestion,
  Feed,
  SCFeedObjectTemplateType,
  FeedSidebarProps,
  FeedProps,
  FeedUpdates,
  LoyaltyProgram,
  Notification,
  NotificationProps,
  NotificationSkeleton,
  PeopleSuggestion,
  Platform,
  SCFeedWidgetType
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {SCNotificationTopicType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCNotificationFeedTemplate';

const classes = {
  root: `${PREFIX}-root`
};

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

  /**
   * Props to spread to feed component
   * @default {}
   */
  FeedProps?: FeedProps;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: FeedUpdates,
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

/**
 * > API documentation for the Community-JS Notification Feed Template. Learn about the available props and the CSS API.

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
      {...FeedProps}
    />
  );
}
