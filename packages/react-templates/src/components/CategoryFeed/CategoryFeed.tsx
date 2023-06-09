import React, {useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {
  CategoryTrendingFeedWidget,
  CategoryTrendingUsersWidget,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedProps,
  FeedRef,
  FeedSidebarProps,
  InlineComposerWidget,
  SCFeedObjectTemplateType,
  SCFeedWidgetType
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType, SCCustomAdvPosition} from '@selfcommunity/types';
import {CategoryFeedSkeleton} from './index';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCCategoryFeedTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoryFeedProps {
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
   * Category Object
   * @default null
   */
  category?: SCCategoryType;

  /**
   * Id of the category for filter the feed
   * @default null
   */
  categoryId?: number;

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
  FeedProps?: Omit<
    FeedProps,
    'endpoint' | 'widgets' | 'ItemComponent' | 'itemPropsGenerator' | 'itemIdGenerator' | 'ItemSkeleton' | 'ItemSkeletonProps' | 'FeedSidebarProps'
  >;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: CategoryTrendingUsersWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: CategoryTrendingFeedWidget,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

/**
 * > API documentation for the Community-JS Category Feed Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific category's feed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/CategoryFeed)

 #### Import

 ```jsx
 import {CategoryFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoryFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function CategoryFeed(inProps: CategoryFeedProps): JSX.Element {
  // PROPS
  const props: CategoryFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'category_feed',
    className,
    category,
    categoryId,
    widgets = WIDGETS,
    FeedObjectProps = {},
    FeedSidebarProps = null,
    FeedProps = {}
  } = props;

  // REF
  const feedRef = useRef<FeedRef>();

  // Hooks
  const {scCategory} = useSCFetchCategory({id: categoryId, category});

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    // Not insert if the category does not match
    if (feedObject.categories.findIndex((c) => c.id === scCategory.id) === -1) {
      return;
    }

    // Hydrate feedUnit
    const feedUnit = {
      type: feedObject.type,
      [feedObject.type]: feedObject,
      seen_by_id: [],
      has_boost: false
    };
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit, true);
  };

  // WIDGETS
  const _widgets = useMemo(
    () =>
      widgets.map((w) => {
        if (scCategory) {
          return {...w, componentProps: {...w.componentProps, categoryId: scCategory.id}};
        }
        return w;
      }),
    [widgets, scCategory]
  );

  if (!scCategory) {
    return <CategoryFeedSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={feedRef}
      endpoint={{
        ...Endpoints.CategoryFeed,
        url: () => Endpoints.CategoryFeed.url({id: scCategory.id})
      }}
      widgets={_widgets}
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
      HeaderComponent={<InlineComposerWidget onSuccess={handleComposerSuccess} defaultValue={{categories: [scCategory]}} />}
      CustomAdvProps={{position: SCCustomAdvPosition.POSITION_FEED, categoriesId: [scCategory.id]}}
      enabledCustomAdvPositions={[
        SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
        SCCustomAdvPosition.POSITION_FEED,
        SCCustomAdvPosition.POSITION_BELOW_TOPBAR
      ]}
      {...FeedProps}
    />
  );
}
