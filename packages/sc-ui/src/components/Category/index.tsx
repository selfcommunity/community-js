import React from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, CardProps} from '@mui/material';
import {useSCFetchCategory} from '@selfcommunity/core';
import CategoryBoxSkeleton from '../Skeleton/CategoryBoxSkeleton';
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
  avatar: `${PREFIX}-avatar`,
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

export interface CategoryProps extends CardProps {
  /**
   * Id of category object
   * @default null
   */
  id?: number;
  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;
  /**
   * Hides category component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Renders different section for popular categories list
   * @default false
   */
  popular?: boolean;
}
export default function Category(props: CategoryProps): JSX.Element {
  const {id = null, category = null, popular = false, autoHide = false, ...rest} = props;
  const {scCategory, setSCCategory} = useSCFetchCategory({id, category});
  const intl = useIntl();

  const c = (
    <React.Fragment>
      {scCategory ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={scCategory.name} src={scCategory.image_original} variant="square" className={classes.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={scCategory.name}
            secondary={popular ? `${intl.formatMessage(messages.categoryFollowers, {total: category.followers_count})}` : scCategory.slogan}
            className={classes.title}
          />
          <ListItemSecondaryAction className={classes.actions}>
            <FollowButton category={scCategory} />
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <CategoryBoxSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Render root object
   */
  return (
    <Root {...rest}>
      <CardContent>
        <List>{c}</List>
      </CardContent>
    </Root>
  );
}
