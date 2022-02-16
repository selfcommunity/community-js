import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCFeedUpdatesSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(GenericSkeleton)(() => ({}));

export default function FeedUpdatesSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
