import React from 'react';
import {CommentsObjectSkeleton} from '../CommentsObject';
import {PREFIX} from './constants';
import {styled} from '@mui/material/styles';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(CommentsObjectSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export default function CommentsFeedObjectSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
