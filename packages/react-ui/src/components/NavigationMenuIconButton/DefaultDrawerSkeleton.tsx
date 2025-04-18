import React from 'react';
import CategorySkeleton from '../Category/Skeleton';
import {Box, BoxProps, ListItem, styled} from '@mui/material';

export const PREFIX = 'SCDefaultDrawerSkeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'root'
})(() => ({}));

export type DefaultDrawerSkeletonProps = BoxProps;

/**
 * > API documentation for the Community-JS Default Drawer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SCDefaultDrawerSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCDefaultDrawerSkeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCDefaultDrawerSkeleton-root|Styles applied to the root element.|
 *
 */
export default function DefaultDrawerSkeleton(props: DefaultDrawerSkeletonProps): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      {[...Array(5)].map((category, index) => (
        <ListItem key={index}>
          <CategorySkeleton elevation={0} actions={null} />
        </ListItem>
      ))}
    </Root>
  );
}
