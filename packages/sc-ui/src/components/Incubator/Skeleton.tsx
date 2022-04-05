import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import {Button} from '@mui/material';

const PREFIX = 'SCIncubatorSkeleton';

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
