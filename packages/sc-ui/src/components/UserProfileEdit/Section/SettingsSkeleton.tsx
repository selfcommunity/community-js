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

function SettingsSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Root>
  );
}

export default SettingsSkeleton;
