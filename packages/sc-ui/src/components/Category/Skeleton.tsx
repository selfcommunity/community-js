import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';
import { Button } from '@mui/material';

const PREFIX = 'SCCategorySkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Widget)(({theme}) => ({}));

export default function CategorySkeleton(props): JSX.Element {
  return (
    <Root
      className={classes.root}
      {...props}
      image={<Skeleton animation="wave" variant="rectangular" width={40} height={40} />}
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      actions={
        <Button size="small" variant="outlined" disabled>
          <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      }
    />
  );
}
