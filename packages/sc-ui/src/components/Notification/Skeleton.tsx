import React from 'react';
import CardContent from '@mui/material/CardContent';
import {styled} from '@mui/material/styles';
import {CardHeader} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';

const PREFIX = 'SCNotificationSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Widget)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

/**
 * > API documentation for the Community-UI Notification Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NotificationSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCNotificationSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNotificationSkeleton-root|Styles applied to the root element.|
 *
 */
export default function NotificationSkeleton(props): JSX.Element {
  const notification = (
    <>
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
    </>
  );

  return (
    <Root className={classes.root} {...props}>
      <CardContent sx={{paddingBottom: 1}}>
        <Skeleton animation="wave" height={20} style={{marginBottom: 0}} />
        <Skeleton animation="wave" height={15} width="60%" style={{marginBottom: 0}} />
      </CardContent>
      {[...Array(Math.floor(Math.random() * 5) + 1)].map((x, i) => (
        <React.Fragment key={i}>{notification}</React.Fragment>
      ))}
    </Root>
  );
}
