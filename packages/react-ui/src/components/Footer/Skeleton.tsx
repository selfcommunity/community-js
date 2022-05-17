import React from 'react';
import {styled} from '@mui/material/styles';
import {CardContent} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';

const PREFIX = 'SCFooterSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Footer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FooterSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFooterSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFooterSkeleton-root|Styles applied to the root element.|
 *
 */

export default function FooterSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <Skeleton animation="wave" height={10} style={{marginBottom: 10}} />
        <Skeleton animation="wave" height={10} width="60%" />
      </CardContent>
    </Root>
  );
}
