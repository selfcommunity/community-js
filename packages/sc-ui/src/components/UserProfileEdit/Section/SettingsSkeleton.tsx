import React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCUserProfileEditSectionSettingsSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

/**
 * > API documentation for the Community-UI Settings Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SettingsSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUserProfileEditSectionSettingsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileEditSectionSettingsSkeleton-root|Styles applied to the root element.|
 *
 */
export default function SettingsSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Root>
  );
}
