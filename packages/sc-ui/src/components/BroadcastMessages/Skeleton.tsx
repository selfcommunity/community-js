import React from 'react';
import {Box, Card, CardContent, CardHeader, Skeleton} from '@mui/material';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';

const MESSAGE_PREFIX = 'SCBroadcastMessageSkeleton';

const messageClasses = {
  root: `${MESSAGE_PREFIX}-root`,
  header: `${MESSAGE_PREFIX}-header`,
  title: `${MESSAGE_PREFIX}-title`,
  media: `${MESSAGE_PREFIX}-media`,
  content: `${MESSAGE_PREFIX}-content`
};

const MessageRoot = styled(Widget, {
  name: MESSAGE_PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

export function MessageSkeleton(props): JSX.Element {
  return (
    <MessageRoot className={classes.root}>
      <CardHeader
        className={messageClasses.header}
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        title={<Skeleton animation="wave" variant="circular" width={60} height={20} style={{marginBottom: 6}} />}
      />
      <CardContent className={messageClasses.title}>
        <React.Fragment>
          <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
        </React.Fragment>
      </CardContent>
      <Box className={messageClasses.media}>
        <Skeleton sx={{height: 190}} animation="wave" variant="rectangular" />
      </Box>
      <CardContent className={messageClasses.content}>
        <React.Fragment>
          <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
          <Skeleton animation="wave" height={10} width={60} />
        </React.Fragment>
      </CardContent>
    </MessageRoot>
  );
}

const PREFIX = 'SCBroadcastMessagesSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function BroadcastMessagesSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
    </Root>
  );
}
