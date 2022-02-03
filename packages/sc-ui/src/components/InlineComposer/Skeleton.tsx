import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box} from '@mui/material';
import Paper from '@mui/material/Paper';

const PREFIX = 'SCInlineComposerSkeleton';

const classes = {
  input: `${PREFIX}-input`,
  actions: `${PREFIX}-actions`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Paper, {
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
    margin: 15
  }
}));

export default function InlineComposerSkeleton(): JSX.Element {
  return (
    <Root>
      <Box className={classes.input}>
        <Skeleton sx={{height: 40}} animation="wave" variant="rectangular" />
      </Box>
      <Box className={classes.actions}>
        <Skeleton animation="wave" sx={{height: 10, width: 50}} />
      </Box>
      <Box className={classes.avatar}>
        <Skeleton className={classes.avatar} animation="wave" variant="circular" width={40} height={40} />
      </Box>
    </Root>
  );
}
