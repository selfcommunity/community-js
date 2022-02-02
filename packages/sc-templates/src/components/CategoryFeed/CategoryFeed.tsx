import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, StickySidebarProps, Feed, InlineComposer, TrendingFeedObject, TrendingPeople, SCFeedWidgetType} from '@selfcommunity/ui';
import {Endpoints} from '@selfcommunity/core';

const PREFIX = 'SCCategoryFeedTemplate';

const Root = styled(Box, {
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
  StickySidebarProps?: StickySidebarProps;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: InlineComposer,
    componentProps: {variant: 'outlined'},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: TrendingPeople,
    componentProps: {variant: 'outlined'},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: TrendingFeedObject,
    componentProps: {variant: 'outlined'},
    column: 'right',
    position: 1
  }
];

export default function CategoryFeed(props: CategoryFeedProps): JSX.Element {
  // PROPS
  const {id = 'category_feed', className, categoryId, widgets = WIDGETS, FeedObjectProps = {variant: 'outlined'}, StickySidebarProps = null} = props;

  // STATE
  const [_widgets, setWidgets] = useState<SCFeedWidgetType[]>(
    widgets.map((w) => {
      return {...w, componentProps: {...w.componentProps, categoryId}};
    })
  );

  // Component props update
  useEffect(
    () =>
      setWidgets(
        widgets.map((w) => {
          return {...w, componentProps: {...w.componentProps, categoryId}};
        })
      ),
    [categoryId, widgets]
  );

  return (
    <Root id={id} className={className}>
      <Feed
        endpoint={{
          ...Endpoints.CategoryFeed,
          url: () => Endpoints.CategoryFeed.url({id: categoryId})
        }}
        widgets={_widgets}
        FeedObjectProps={FeedObjectProps}
        StickySidebarProps={StickySidebarProps}
      />
    </Root>
  );
}
