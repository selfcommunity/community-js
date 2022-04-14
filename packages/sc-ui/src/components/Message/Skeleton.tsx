import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';

const PREFIX = 'SCMessageSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));
/**
 * > API documentation for the Community-UI Message Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MessageSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCMessageSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCMessageSkeleton-root|Styles applied to the root element.|
 |list|.SCMessageSkeleton-list|Styles applied to the list element.|
 *
 */
export default function MessageSkeleton(props): JSX.Element {
  const m = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
    </ListItem>
  );
  return (
    <Root className={classes.root} {...props}>
      <List>{m}</List>
    </Root>
  );
}
