import React from 'react';
import {styled} from '@mui/material/styles';
import {List} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import NotificationItem from '../../shared/NotificationItem';
import {SCNotificationObjectTemplateType} from '../../types/notification';

const PREFIX = 'SCNotificationSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`
};

const Root = styled(List)(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.item}`]: {
    marginBottom: theme.spacing(),
    '&::before': {
      height: '11% !important'
    }
  }
}));

export default function SnippetNotificationSkeleton(props): JSX.Element {
  const notificationSkeleton = (
    <NotificationItem
      className={classes.item}
      template={SCNotificationObjectTemplateType.SNIPPET}
      image={<Skeleton animation="wave" variant="circular" width={25} height={25} />}
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
    />
  );
  return (
    <Root className={classes.root} {...props}>
      {[...Array(7)].map((x, i) => (
        <React.Fragment key={i}>{notificationSkeleton}</React.Fragment>
      ))}
    </Root>
  );
}
