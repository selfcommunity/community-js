import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchCategory, useSCRouting} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import CategorySkeleton from './Skeleton';
import FollowButton, {CategoryFollowButtonProps} from '../CategoryFollowButton';
import {defineMessages, useIntl} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItemButton from '../../shared/BaseItemButton';
import {WidgetProps} from '../Widget';

const messages = defineMessages({
  categoryFollowers: {
    id: 'ui.category.categoryFollowers',
    defaultMessage: 'ui.category.categoryFollowers'
  }
});

const PREFIX = 'SCCategory';

const classes = {
  root: `${PREFIX}-root`,
  categoryImage: `${PREFIX}-category-image`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .SCBaseItemButton-primary, & .SCBaseItemButton-secondary': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    width: '44%'
  }
}));

export interface CategoryProps extends WidgetProps {
  /**
   * Category Id
   * @default null
   */
  categoryId?: number;
  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Props to spread to follow button
   * @default {}
   */
  followCategoryButtonProps?: CategoryFollowButtonProps;
  /**
   * Prop to show category followers as secondary text
   * @default true
   */
  showFollowers?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Category component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {Category} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategory` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategory-root|Styles applied to the root element.|
 |categoryImage|.SCCategory-category-image|Styles applied to category image element.|
 |title|.SCCategory-title|Styles applied to the title element.|
 |actions|.SCCategory-actions|Styles applied to action section.|

 * @param inProps
 */
export default function Category(inProps: CategoryProps): JSX.Element {
  // PROPS
  const props: CategoryProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    categoryId = null,
    category = null,
    className = null,
    elevation,
    autoHide = false,
    followCategoryButtonProps = {},
    showFollowers = true,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  // INTL
  const intl = useIntl();

  if (!scCategory) {
    return <CategorySkeleton elevation={elevation} />;
  }

  // RENDER
  if (!autoHide) {
    return (
      <Root
        elevation={elevation}
        className={classNames(classes.root, className)}
        ButtonBaseProps={{component: Link, to: scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, scCategory)}}
        image={<Avatar alt={scCategory.name} src={scCategory.image_medium} variant="square" className={classes.categoryImage} />}
        primary={scCategory.name}
        secondary={showFollowers ? `${intl.formatMessage(messages.categoryFollowers, {total: scCategory.followers_counter})}` : scCategory.slogan}
        actions={<FollowButton category={scCategory} {...followCategoryButtonProps} />}
        {...rest}
      />
    );
  }
  return null;
}
