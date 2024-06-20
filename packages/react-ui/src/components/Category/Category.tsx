import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, useMediaQuery, useTheme} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCFetchCategory, useSCRouting} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import CategorySkeleton from './Skeleton';
import CategoryFollowButton, {CategoryFollowButtonProps} from '../CategoryFollowButton';
import {defineMessages, useIntl} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItemButton from '../../shared/BaseItemButton';
import {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import {formatCroppedName} from '../../utils/string';
import {CATEGORY_NAME_MAX_LENGTH_DESKTOP, CATEGORY_NAME_MAX_LENGTH_MOBILE} from '../../constants/Category';

const messages = defineMessages({
  categoryFollowers: {
    id: 'ui.category.categoryFollowers',
    defaultMessage: 'ui.category.categoryFollowers'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  categoryImage: `${PREFIX}-category-image`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
  categoryFollowButtonProps?: CategoryFollowButtonProps;
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
 *
 * This component renders a category item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Category)

 #### Import
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
    categoryFollowButtonProps = {},
    showFollowers = true,
    ButtonBaseProps = null,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  // MEMO
  const _ButtonBaseProps = useMemo(
    () => (ButtonBaseProps ? ButtonBaseProps : {component: Link, to: scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, scCategory)}),
    [ButtonBaseProps, scRoutingContext, scCategory]
  );

  // HOOKS
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!scCategory) {
    return <CategorySkeleton elevation={elevation} />;
  }

  // RENDER
  if (!autoHide) {
    return (
      <Root
        elevation={elevation}
        className={classNames(classes.root, className)}
        ButtonBaseProps={_ButtonBaseProps}
        image={<Avatar alt={scCategory.name} src={scCategory.image_medium} variant="square" className={classes.categoryImage} />}
        primary={
          isMobile
            ? formatCroppedName(scCategory.name, CATEGORY_NAME_MAX_LENGTH_MOBILE)
            : formatCroppedName(scCategory.name, CATEGORY_NAME_MAX_LENGTH_DESKTOP)
        }
        secondary={showFollowers ? `${intl.formatMessage(messages.categoryFollowers, {total: scCategory.followers_counter})}` : scCategory.slogan}
        actions={<CategoryFollowButton category={scCategory} {...categoryFollowButtonProps} />}
        {...rest}
      />
    );
  }
  return null;
}
