import React from 'react';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  title: `${PREFIX}-title`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Composer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ComposerSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCComposerSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCComposerSkeleton-root|Styles applied to the root element.|
 *
 */
export default function ComposerSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton sx={{height: 190}} animation="wave" variant="rectangular" />
    </Root>
  );
}
