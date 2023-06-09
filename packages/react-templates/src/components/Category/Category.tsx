import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, CategoryHeader, SCFeedWidgetType} from '@selfcommunity/react-ui';
import CategoryFeed, {CategoryFeedProps} from '../CategoryFeed';
import {useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import CategorySkeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCCategoryTemplate';

const classes = {
  root: `${PREFIX}-root`,
  feed: `${PREFIX}-feed`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.feed}`]: {
    marginTop: theme.spacing(2)
  }
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
  categoryId?: number | string;

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
   * Props to spread to Categoryfeed component
   * @default {}
   */
  CategoryFeedProps?: CategoryFeedProps;
}
/**
 * > API documentation for the Community-JS Category Template. Learn about the available props and the CSS API.
 * <br/>This component renders a specific category's template.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/Category)

 #### Import

 ```jsx
 import {Category} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoryTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTemplate-root|Styles applied to the root element.|
 |feed|.SCCategoryTemplate-feed|Styles applied to the feed element.|
 *
 * @param inProps
 */
export default function Category(inProps: CategoryProps): JSX.Element {
  // PROPS
  const props: CategoryProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'category', className, category, categoryId, widgets, FeedObjectProps, FeedSidebarProps, CategoryFeedProps = {}} = props;

  // Hooks
  const {scCategory} = useSCFetchCategory({id: categoryId, category});

  if (!scCategory) {
    return <CategorySkeleton />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <CategoryHeader category={scCategory} />
      <CategoryFeed
        className={classes.feed}
        category={scCategory}
        widgets={widgets}
        FeedObjectProps={FeedObjectProps}
        FeedSidebarProps={FeedSidebarProps}
        {...CategoryFeedProps}
      />
    </Root>
  );
}
