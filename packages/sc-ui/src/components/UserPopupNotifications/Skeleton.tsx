import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Skeleton from '@mui/material/Skeleton';
import ListItemText from '@mui/material/ListItemText';

const PREFIX = 'SCNotificationSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

export default function NotificationSkeleton(props): JSX.Element {
  const notificationSkeleton = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
    </ListItem>
  );
  return (
    <Root className={classes.root} {...props}>
      {[...Array(7)].map((x, i) => (
        <React.Fragment key={i}>{notificationSkeleton}</React.Fragment>
      ))}
    </Root>
  );
}
