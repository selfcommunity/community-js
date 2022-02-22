import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CommentObjectSkeleton from '../CommentObject';

const PREFIX = 'SCCommentsObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function CommentsObjectSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((comment, index) => (
            <CommentObjectSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
