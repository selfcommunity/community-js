import React from 'react';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCFeedUpdatesSkeleton';

const classes = {
  list: `${PREFIX}-list`
};

const Root = styled(GenericSkeleton)(() => ({}));

export default function FeedUpdatesSkeleton(props): JSX.Element {
  return <Root {...props} />;
}
