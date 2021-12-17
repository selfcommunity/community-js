import React from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
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

function Category({
  id = null,
  category = null,
  popular = null,
  autoHide = null,
  ...rest
}: {
  id?: number;
  category?: SCCategoryType;
  popular?: boolean;
  autoHide?: boolean;
  [p: string]: any;
}): JSX.Element {
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

  return (
    <Root {...rest}>
      <CardContent>
        <List>{c}</List>
      </CardContent>
    </Root>
  );
}

export default Category;
