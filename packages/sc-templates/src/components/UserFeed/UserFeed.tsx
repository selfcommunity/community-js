import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  CategoriesFollowed,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedObjectTemplateType,
  FeedSidebarProps,
  SCFeedWidgetType,
  UsersFollowed
} from '@selfcommunity/ui';
import { Endpoints, SCUserType, useSCFetchUser } from '@selfcommunity/core';

const PREFIX = 'SCUserFeedTemplate';

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface UserFeedProps {
  /**
   * Id of the feed object
   * @default 'user_feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Widgets to be rendered into the feed
   * @default [CategoriesFollowed, UserFollowed]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

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
    component: CategoriesFollowed,
    componentProps: {variant: 'outlined'},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UsersFollowed,
    componentProps: {variant: 'outlined'},
    column: 'right',
    position: 1
  }
];

export default function UserFeed(props: UserFeedProps): JSX.Element {
  // PROPS
  const {id = 'user_feed', className, userId, user, widgets = WIDGETS, FeedObjectProps = {variant: 'outlined'}, FeedSidebarProps = null} = props;

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  // STATE
  const [_widgets, setWidgets] = useState<SCFeedWidgetType[]>(
    widgets.map((w) => {
      return {...w, componentProps: {...w.componentProps, userId}};
    })
  );

  // Component props update
  useEffect(
    () =>
      setWidgets(
        widgets.map((w) => {
          return {...w, componentProps: {...w.componentProps, userId: scUser.id}};
        })
      ),
    [user, widgets]
  );

  return (
    <Root
      id={id}
      className={className}
      endpoint={{
        ...Endpoints.UserFeed,
        url: () => Endpoints.UserFeed.url({id: scUser.id})
      }}
      widgets={_widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null
      })}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: FeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
    />
  );
}
