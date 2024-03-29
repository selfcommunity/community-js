import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(ListItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS PrivateMessageSnippetItem Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippetItemSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippetItem-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippetItem-skeleton-root|Styles applied to the root element.|
 |list|.SCPrivateMessageSnippetItem-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageSnippetItemSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();
  return (
    <Root className={classes.root} {...props} secondaryAction={<Skeleton animation="wave" height={30} width={5} />}>
      <ListItemAvatar>
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeMedium}
          height={theme.selfcommunity.user.avatar.sizeMedium}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
    </Root>
  );
}
