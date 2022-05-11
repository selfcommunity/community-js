import React from 'react';
import {styled} from '@mui/material/styles';
import {CommentObjectSkeleton} from '../CommentObject';
import {Box} from '@mui/material';

const PREFIX = 'SCCommentsObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box)(({theme}) => ({
  width: '100%'
}));

/**
 * > API documentation for the Community-UI Comments Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentsObjectSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCommentsObjectSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentsObjectSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CommentsObjectSkeleton(props: {count?: number; CommentObjectSkeletonProps?: any; [p: string]: any}): JSX.Element {
  const {count = 3, CommentObjectSkeletonProps = {}, ...rest} = props;
  return (
    <Root className={classes.root} {...rest}>
      {[...Array(count)].map((comment, index) => (
        <CommentObjectSkeleton key={index} {...CommentObjectSkeletonProps} />
      ))}
    </Root>
  );
}
