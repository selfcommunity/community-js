import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, Stack} from '@mui/material';
import Widget from '../Widget';

const PREFIX = 'SCInlineComposerSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  input: `${PREFIX}-input`,
  actions: `${PREFIX}-actions`,
  action: `${PREFIX}-action`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  [`& .${classes.input}`]: {
    flexGrow: 2
  },
  [`& .${classes.actions}`]: {
    marginLeft: 15,
    marginRight: 15
  }
}));

export default function InlineComposerSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Box className={classes.input}>
        <Skeleton sx={{height: 40}} animation="wave" variant="text" />
      </Box>
      <Stack className={classes.actions} direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Skeleton className={classes.action} animation="wave" variant="circular" width={27} height={27} />
        <Skeleton className={classes.action} animation="wave" variant="circular" width={27} height={27} />
        <Skeleton className={classes.action} animation="wave" variant="circular" width={27} height={27} />
        <Skeleton className={classes.action} animation="wave" variant="circular" width={27} height={27} />
      </Stack>
      <Box className={classes.avatar}>
        <Skeleton className={classes.avatar} animation="wave" variant="circular" width={40} height={40} />
      </Box>
    </Root>
  );
}
