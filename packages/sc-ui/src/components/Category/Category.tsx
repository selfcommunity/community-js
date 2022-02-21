import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, CardProps} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, SCUserContext, SCUserContextType, useSCFetchCategory, useSCRouting} from '@selfcommunity/core';
import CategorySkeleton from './Skeleton';
import FollowButton, {FollowCategoryButtonProps} from '../FollowCategoryButton';
import {SCCategoryType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import classNames from 'classnames';

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

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700
}));

export interface CategoryProps extends Pick<CardProps, Exclude<keyof CardProps, 'id'>> {
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
   * Renders different section for popular categories list
   * @default false
   */
  popular?: boolean;
  /**
   * Props to spread to follow button
   * @default {}
   */
  followCategoryButtonProps?: FollowCategoryButtonProps;
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

 * @param props
 */
export default function Category(props: CategoryProps): JSX.Element {
  // PROPS
  const {id = null, category = null, className = null, popular = false, autoHide = false, followCategoryButtonProps = {}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
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
            primary={scCategory.name}
            secondary={popular ? `${intl.formatMessage(messages.categoryFollowers, {total: category.followers_count})}` : scCategory.slogan}
            className={classes.title}
          />
          {scUserContext.user && (
            <ListItemSecondaryAction className={classes.actions}>
              <FollowButton category={scCategory} {...followCategoryButtonProps} />
            </ListItemSecondaryAction>
          )}
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
