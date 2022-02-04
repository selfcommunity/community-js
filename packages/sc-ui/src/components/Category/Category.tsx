import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, CardProps} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, SCUserContext, SCUserContextType, useSCFetchCategory, useSCRouting} from '@selfcommunity/core';
import CategorySkeleton from './Skeleton';
import FollowButton from '../FollowCategoryButton';
import {SCCategoryType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  categoryFollowers: {
    id: 'ui.category.categoryFollowers',
    defaultMessage: 'ui.category.categoryFollowers'
  }
});

const PREFIX = 'SCCategory';

const classes = {
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
   * Callback function on follow action.
   * @default null
   */
  onFollowProps?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Category(props: CategoryProps): JSX.Element {
  // PROPS
  const {id = null, category = null, className = null, popular = false, autoHide = false, onFollowProps, ...rest} = props;

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
              <FollowButton category={scCategory} onFollow={onFollowProps} />
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
      <Root className={className} {...rest}>
        <CardContent>
          <List>{c}</List>
        </CardContent>
      </Root>
    );
  }
  return null;
}
