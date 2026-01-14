import React from 'react';
import {Box, styled} from '@mui/material';
import {PREFIX} from './constants';
import LessonCommentObjectSkeleton from '../LessonCommentObject/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Comments Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LessonCommentObjectsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLessonCommentObjects-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLessonCommentObjects-skeleton-root|Styles applied to the root element.|
 *
 */
export default function LessonCommentObjectsSkeleton(props: {count?: number}): JSX.Element {
  const {count = 3, ...rest} = props;
  return (
    <Root className={classes.root} {...rest}>
      {[...Array(count)].map((comment, index) => (
        <LessonCommentObjectSkeleton key={index} elevation={0} />
      ))}
    </Root>
  );
}
