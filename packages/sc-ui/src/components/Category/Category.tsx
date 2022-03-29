import React from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchCategory, useSCRouting} from '@selfcommunity/core';
import CategorySkeleton from './Skeleton';
import FollowButton, {FollowCategoryButtonProps} from '../FollowCategoryButton';
import {SCCategoryType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';

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

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoryProps {
  /**
   * Id of category object
   * @default null
   */
  id?: number;
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
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Props to spread to follow button
   * @default {}
   */
  followCategoryButtonProps?: FollowCategoryButtonProps;
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
 * > API documentation for the Community-UI Category component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {Category} from '@selfcommunity/ui';
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

  const {id = null, category = null, className = null, autoHide = false, followCategoryButtonProps = {}, showFollowers = true, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const {scCategory, setSCCategory} = useSCFetchCategory({id, category});

  // INTL
  const intl = useIntl();

  /**
   * Renders category object
   */
  const c = (
    <React.Fragment>
      {scCategory ? (
        <ListItem button={true} component={Link} to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, scCategory)}>
          <ListItemAvatar>
            <Avatar alt={scCategory.name} src={scCategory.image_medium} variant="square" className={classes.categoryImage} />
          </ListItemAvatar>
          <ListItemText
            secondaryTypographyProps={{style: {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}}
            primary={scCategory.name}
            secondary={showFollowers ? `${intl.formatMessage(messages.categoryFollowers, {total: scCategory.followers_counter})}` : scCategory.slogan}
            className={classes.title}
          />
          <ListItemSecondaryAction className={classes.actions}>
            <FollowButton category={scCategory} {...followCategoryButtonProps} />
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <CategorySkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        <List>{c}</List>
      </Root>
    );
  }
  return null;
}
