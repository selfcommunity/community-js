import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Endpoints, SCUserType, useSCFetchUser} from '@selfcommunity/core';
import {
  CategoriesFollowed,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  SCFeedObjectTemplateType,
  FeedRef,
  FeedSidebarProps,
  InlineComposer,
  SCFeedWidgetType,
  UserFollowers,
  UsersFollowed
} from '@selfcommunity/ui';
import {UserFeedSkeleton} from './index';
import useThemeProps from '@mui/material/styles/useThemeProps';
import classNames from 'classnames';

const PREFIX = 'SCUserFeedTemplate';

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
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UsersFollowed,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserFollowers,
    componentProps: {},
    column: 'right',
    position: 2
  }
];

/**
 * > API documentation for the Community-UI User Feed Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFeed} from '@selfcommunity/templates';
 ```

 #### Component Name

 The name `SCUserFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function UserFeed(inProps: UserFeedProps): JSX.Element {
  // PROPS
  const props: UserFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'user_feed', className, userId, user, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null} = props;

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  // STATE
  const [_widgets, setWidgets] = useState<SCFeedWidgetType[]>([]);

  // REF
  const feedRef = useRef<FeedRef>();

  // Component props update
  useEffect(() => {
    if (scUser === null) {
      return;
    }
    setWidgets(
      widgets.map((w) => {
        if (w.component === InlineComposer) {
          return {...w, componentProps: {...w.componentProps, onSuccess: handleComposerSuccess}};
        }
        return {...w, componentProps: {...w.componentProps, userId: scUser.id}};
      })
    );
  }, [scUser, widgets]);

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    // Hydrate feedUnit
    const feedUnit = {
      type: feedObject.type,
      [feedObject.type]: feedObject,
      seen_by_id: [],
      has_boost: false
    };
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit);
  };

  if (scUser === null) {
    return <UserFeedSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={feedRef}
      endpoint={{
        ...Endpoints.UserFeed,
        url: () => Endpoints.UserFeed.url({id: scUser.id})
      }}
      widgets={_widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
    />
  );
}
