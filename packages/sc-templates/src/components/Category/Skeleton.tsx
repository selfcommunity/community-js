import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import CategoryFeedSkeleton from '../CategoryFeed/Skeleton';
import {Skeleton} from '@selfcommunity/ui';

const PREFIX = 'SCCategoryTemplateSkeleton';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export default function CategorySkeleton(): JSX.Element {
  return (
    <Root>
      <Skeleton />
      <CategoryFeedSkeleton />
    </Root>
  );
}
