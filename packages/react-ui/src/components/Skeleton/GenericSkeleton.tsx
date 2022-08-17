import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {CardContent} from '@mui/material';

const PREFIX = 'SCGenericSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Generic Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GenericSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGenericSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGenericSkeleton-root|Styles applied to the root element.|
 |list|.SCGenericSkeleton-list|Styles applied to the list element.|
 *
 */
function GenericSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <Skeleton animation="wave" height={10} style={{marginBottom: 10}} />
        <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 5}} />
        <Skeleton animation="wave" height={10} width="60%" style={{marginBottom: 5}} />
      </CardContent>
    </Root>
  );
}

export default GenericSkeleton;
