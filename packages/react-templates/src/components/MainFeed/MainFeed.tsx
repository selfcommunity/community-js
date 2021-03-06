import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {
  CategoriesSuggestion,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  SCFeedObjectTemplateType,
  FeedSidebarProps,
  FeedProps,
  InlineComposer,
  LoyaltyProgram,
  PeopleSuggestion,
  Platform,
  SCFeedWidgetType
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCMainFeedTemplate';

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

export interface MainFeedProps {
  /**
   * Id of the feed object
   * @default 'feed'
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
  FeedObjectProps?: FeedObjectProps;

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
 * > API documentation for the Community-JS Main Feed Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MainFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCMainFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCMainFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function MainFeed(inProps: MainFeedProps): JSX.Element {
  // PROPS
  const props: MainFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'main_feed', className, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null, FeedProps = {}} = props;

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
      endpoint={Endpoints.MainFeed}
      widgets={widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null,
        markRead: scUser ? !item.seen_by_id.includes(scUser.id) : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
      HeaderComponent={<InlineComposer />}
      requireAuthentication={true}
      {...FeedProps}
    />
  );
}
