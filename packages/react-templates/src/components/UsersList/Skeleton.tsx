import React from 'react';
import {CardContent, ListItem} from '@mui/material';
import {styled} from '@mui/material/styles';
import {BaseItem, Widget, UserSkeleton} from '@selfcommunity/react-ui';
import Skeleton from '@mui/material/Skeleton';
import List from '@mui/material/List';

const PREFIX = 'SCUsersListTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

/**
 * > API documentation for the Community-JS Users List Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UsersListSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUsersListTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUsersListTemplateSkeleton-root|Styles applied to the root element.|
 |list|.SCUsersListTemplateSkeleton-list|Styles applied to the list element.|
 *
 */
export default function UsersListSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <BaseItem
        image={<Skeleton animation="wave" variant="circular" width={80} height={80} />}
        primary={<Skeleton animation="wave" height={20} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((person, index) => (
            <ListItem key={index}>
              <UserSkeleton elevation={1} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
