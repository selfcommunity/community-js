import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {CategoriesFollowed, Feed, SCFeedWidgetType, UserFollowed} from '@selfcommunity/ui';
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
   * @default 'feed'
   */
  id?: string;

  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: CategoriesFollowed,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowed,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

export default function UserFeed(props: UserFeedProps): JSX.Element {
  // PROPS
  const {id = 'user_feed', className, userId} = props;

  // STATE
  const [widgets, setWidgets] = useState<SCFeedWidgetType[]>(
    WIDGETS.map((w) => {
      return {...w, componentProps: {...w.componentProps, userId}};
    })
  );

  // Component props update
  useEffect(
    () =>
      setWidgets(
        WIDGETS.map((w) => {
          return {...w, componentProps: {...w.componentProps, userId}};
        })
      ),
    [userId]
  );

  return (
    <Root id={id} className={className}>
      <Feed
        endpoint={{
          ...Endpoints.UserFeed,
          url: () => Endpoints.UserFeed.url({id: userId})
        }}
        widgets={widgets}
      />
    </Root>
  );
}
