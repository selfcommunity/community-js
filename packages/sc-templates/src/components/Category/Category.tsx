import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, CategoryHeader, SCFeedWidgetType} from '@selfcommunity/ui';
import CategoryFeed from '../CategoryFeed';
import {SCCategoryType, useSCFetchCategory} from '@selfcommunity/core';
import CategorySkeleton from './Skeleton';

const PREFIX = 'SCCategoryTemplate';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface CategoryProps {
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

export default function Category(props: CategoryProps): JSX.Element {
  // PROPS
  const {id = 'category', className, category, categoryId, widgets, FeedObjectProps, FeedSidebarProps} = props;

  // Hooks
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  if (scCategory === null) {
    return <CategorySkeleton />;
  }

  return (
    <Root id={id} className={className}>
      <CategoryHeader category={scCategory} />
      <CategoryFeed categoryId={scCategory.id} widgets={widgets} FeedObjectProps={FeedObjectProps} FeedSidebarProps={FeedSidebarProps} />
    </Root>
  );
}
