import React from 'react';
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {WidgetProps} from '../Widget';
import BaseItem from '../../shared/BaseItem';

const PREFIX = 'SCUserSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseItem)(({theme}) => ({}));

export default function UserSkeleton(props: WidgetProps): JSX.Element {
  return (
    <Root
      className={classes.root}
      {...props}
      image={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      actions={
        <Button size="small" variant="outlined" disabled>
          <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      }
    />
  );
}
