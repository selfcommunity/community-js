import React from 'react';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {Button} from '@mui/material';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCSnippetMessageBoxSkeleton';

const classes = {
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

function SnippetMessageBoxSkeleton(props): JSX.Element {
  const snippet = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
      <ListItemSecondaryAction>
        <Button size="small" variant="outlined" disabled>
          <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
  return (
    <Root {...props}>
      <List>{snippet}</List>
    </Root>
  );
}

export default SnippetMessageBoxSkeleton;
