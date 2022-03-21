import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedObjectTemplateType,
  FeedRef,
  FeedSidebarProps,
  InlineComposer,
  SCFeedWidgetType,
  TrendingFeed,
  TrendingPeople
} from '@selfcommunity/ui';
import {
  Endpoints,
  SCCategoryType,
  SCCustomAdvPosition,
  SCFeedDiscussionType,
  SCFeedObjectTypologyType,
  SCFeedPostType,
  SCFeedStatusType,
  SCFeedUnitActivityType,
  useSCFetchCategory
} from '@selfcommunity/core';
import {CategoryFeedSkeleton} from './index';

const PREFIX = 'SCCategoryFeedTemplate';

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

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
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: InlineComposer,
    componentProps: {},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: TrendingPeople,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: TrendingFeed,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

export default function CategoryFeed(props: CategoryFeedProps): JSX.Element {
  // PROPS
  const {id = 'category_feed', className, category, categoryId, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null} = props;

  // REF
  const feedRef = useRef<FeedRef>();

  // Hooks
  const {scCategory} = useSCFetchCategory({id: categoryId, category});

  // STATE
  const [_widgets, setWidgets] = useState<SCFeedWidgetType[]>([]);

  // EFFECTS
  useEffect(() => {
    if (scCategory === null) {
      return;
    }
    setWidgets(
      widgets.map((w) => {
        if (w.component === InlineComposer) {
          return {...w, componentProps: {...w.componentProps, defaultValue: {categories: [scCategory]}, onSuccess: handleComposerSuccess}};
        }
        return {...w, componentProps: {...w.componentProps, categoryId: scCategory.id}};
      })
    );
  }, [scCategory, widgets]);

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
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit);
  };

  if (scCategory === null) {
    return <CategoryFeedSkeleton />;
  }

  return (
    <Root
      id={id}
      className={className}
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
        template: FeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
      CustomAdvProps={{position: SCCustomAdvPosition.POSITION_FEED, categoriesId: [scCategory.id]}}
    />
  );
}
