import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {CategoriesFollowed, Feed, StickySidebarProps, FeedObjectProps, SCFeedWidgetType, UserFollowed} from '@selfcommunity/ui';
import {Endpoints} from '@selfcommunity/core';

const PREFIX = 'SCUserFeedTemplate';

const Root = styled(Box, {
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
  StickySidebarProps?: StickySidebarProps;
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
    component: UserFollowed,
    componentProps: {variant: 'outlined'},
    column: 'right',
    position: 1
  }
];

export default function UserFeed(props: UserFeedProps): JSX.Element {
  // PROPS
  const {id = 'user_feed', className, userId, widgets = WIDGETS, FeedObjectProps = {variant: 'outlined'}, StickySidebarProps = null} = props;

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
          return {...w, componentProps: {...w.componentProps, userId}};
        })
      ),
    [userId, widgets]
  );

  return (
    <Root id={id} className={className}>
      <Feed
        endpoint={{
          ...Endpoints.UserFeed,
          url: () => Endpoints.UserFeed.url({id: userId})
        }}
        widgets={_widgets}
        FeedObjectProps={FeedObjectProps}
        StickySidebarProps={StickySidebarProps}
      />
    </Root>
  );
}
