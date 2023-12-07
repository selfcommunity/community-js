import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, CardContent, Stack} from '@mui/material';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`,
  input: `${PREFIX}-input`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Inline Composer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {InlineComposerWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCInlineComposerWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCInlineComposerWidget-skeleton-root|Styles applied to the root element.|
 |content|.SCInlineComposerWidget-content|Styles applied to the content element.|
 |input|.SCInlineComposerWidget-input|Styles applied to the input element.|
 |avatar|.SCInlineComposerWidget-avatar|Styles applied to the avatar element.|
 *
 */
export default function InlineComposerWidgetSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Box className={classes.input}>
          <Skeleton animation="wave" variant="text" />
        </Box>
        <Box className={classes.avatar}>
          <Skeleton className={classes.avatar} animation="wave" variant="circular" />
        </Box>
      </CardContent>
    </Root>
  );
}
