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

const Root = styled(Widget)(({theme}) => ({
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

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
