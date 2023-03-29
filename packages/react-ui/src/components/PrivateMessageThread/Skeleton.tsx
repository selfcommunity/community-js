import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import {CardContent, ListSubheader, Skeleton} from '@mui/material';
import List from '@mui/material/List';
import PrivateMessageThreadItemSkeleton from '../PrivateMessageThreadItem/Skeleton';

const PREFIX = 'SCPrivateMessageThreadSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS PrivateMessage Thread Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThreadSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThreadSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThreadSkeleton-root|Styles applied to the root element.|
 |list|.SCPrivateMessageThreadSkeleton-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageThreadSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          <ListSubheader sx={{display: 'flex', justifyContent: 'center'}}>
            <Skeleton animation="wave" height={30} width={120} style={{borderRadius: 20}} />
          </ListSubheader>
          {[...Array(6)].map((item, index) => (
            <PrivateMessageThreadItemSkeleton index={index} key={index} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
