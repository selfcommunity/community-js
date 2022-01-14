import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {Feed, InlineComposer, TrendingFeedObject, TrendingPeople, SCFeedWidgetType} from '@selfcommunity/ui';
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
  const {id = 'category_feed', className, categoryId} = props;

  // STATE
  const [widgets, setWidgets] = useState<SCFeedWidgetType[]>(
    WIDGETS.map((w) => {
      return {...w, componentProps: {...w.componentProps, categoryId}};
    })
  );

  // Component props update
  useEffect(
    () =>
      setWidgets(
        WIDGETS.map((w) => {
          return {...w, componentProps: {...w.componentProps, categoryId}};
        })
      ),
    [categoryId]
  );

  return (
    <Root id={id} className={className}>
      <Feed
        endpoint={{
          ...Endpoints.CategoryFeed,
          url: () => Endpoints.CategoryFeed.url({id: categoryId})
        }}
        widgets={widgets}
        FeedObjectProps={{variant: 'outlined'}}
      />
    </Root>
  );
}
