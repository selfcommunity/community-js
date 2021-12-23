import React from 'react';
import Card from '@mui/material/Card';
import {CardContent} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCGenericSkeleton';

const classes = {
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

function GenericSkeleton(props): JSX.Element {
  return (
    <Root {...props}>
      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{marginBottom: 10}} />
          <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 5}} />
          <Skeleton animation="wave" height={10} width="60%" style={{marginBottom: 5}} />
        </React.Fragment>
      </CardContent>
    </Root>
  );
}

export default GenericSkeleton;
