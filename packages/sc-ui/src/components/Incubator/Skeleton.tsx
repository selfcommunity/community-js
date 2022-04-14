import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';
import {Button} from '@mui/material';

const PREFIX = 'SCIncubatorSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

/**
 * > API documentation for the Community-UI Incubator Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {IncubatorSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCIncubatorSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSkeleton-root|Styles applied to the root element.|
 |list|.SCIncubatorSkeleton-list|Styles applied to the list element.|
 *
 */
export default function IncubatorSkeleton(props): JSX.Element {
  const incubator = (
    <>
      <ListItem>
        <ListItemText
          primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
          secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
        />
      </ListItem>
      <Button size="small" variant="outlined" disabled sx={{marginLeft: 2}}>
        <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
      </Button>
    </>
  );
  return (
    <Root className={classes.root} {...props}>
      <List>{incubator}</List>
    </Root>
  );
}
