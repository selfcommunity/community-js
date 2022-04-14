import React from 'react';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CommentObjectSkeleton from '../CommentObject';
import Widget from '../Widget';
import {CardContent} from '@mui/material';

const PREFIX = 'SCCommentsObjectSkeleton';

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
