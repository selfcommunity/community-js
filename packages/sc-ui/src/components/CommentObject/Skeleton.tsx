import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {CardContent} from '@mui/material';
import BaseItem from '../../shared/BaseItem';

const PREFIX = 'SCCommentObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseItem)(({theme}) => ({}));

export default function CommentObjectSkeleton(props): JSX.Element {
  const {WidgetProps, ...rest} = props;
  return (
    <Root
      className={classes.root}
      disableTypography
      {...rest}
      image={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
      secondary={
        <>
          <Widget {...WidgetProps}>
            <CardContent>
              <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
              <Skeleton animation="wave" height={10} width="40%" />
            </CardContent>
          </Widget>
        </>
      }
    />
  );
}
