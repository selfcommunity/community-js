import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import {CardContent} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import ListItemText from '@mui/material/ListItemText';

const PREFIX = 'SCThreadSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '600px',
  height: '100%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    height: '100%',
    maxHeight: '450px',
    width: '345px'
  }
}));
/**
 * > API documentation for the Community-JS Thread Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ThreadSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCThreadSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCThreadSkeleton-root|Styles applied to the root element.|
 |list|.SCThreadSkeleton-list|Styles applied to the list element.|
 *
 */
export default function ThreadSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(6)].map((category, index) => (
            <ListItem key={index}>
              <ListItemText
                sx={{display: 'flex', justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'}}
                primary={
                  <>
                    <Skeleton animation="wave" height={50} width={100} style={{borderRadius: 20}} />
                    <Skeleton animation="wave" height={10} width={30} />
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
