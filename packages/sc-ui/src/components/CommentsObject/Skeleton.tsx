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
  width: '100%',
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

/**
 * > API documentation for the Community-UI Comments Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentsObjectSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCCommentsObjectSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentsObjectSkeleton-root|Styles applied to the root element.|
 |list|.SCCommentsObjectSkeleton-root|Styles applied to the list element.|
 *
 */
export default function CommentsObjectSkeleton(props: {count?: number; CommentObjectSkeletonProps?: any, [p: string]: any}): JSX.Element {
  const {count = 3, CommentObjectSkeletonProps = {}, ...rest} = props;
  return (
    <Root className={classes.root} {...rest}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(count)].map((comment, index) => (
            <CommentObjectSkeleton key={index} {...CommentObjectSkeletonProps} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
