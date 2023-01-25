import React from 'react';
import {Box, Card, CardContent, CardHeader, Skeleton, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {SCThemeType} from '@selfcommunity/react-core';

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
/**
 * > API documentation for the Community-JS Broadcast Message Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MessageSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBroadcastMessageSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessageSkeleton-root|Styles applied to the root element.|
 |header|.SCBroadcastMessageSkeleton-header|Styles applied to the header element.|
 |title|.SCBroadcastMessageSkeleton-title|Styles applied to the title element.|
 |media|.SCBroadcastMessageSkeleton-media|Styles applied to the media element.|
 |content|.SCBroadcastMessageSkeleton-content|Styles applied to the content section.|
 *
 */
export function MessageSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <MessageRoot className={classes.root}>
      <CardHeader
        className={messageClasses.header}
        avatar={<Skeleton animation="wave" variant="circular" width={theme.selfcommunity.user.avatar.sizeMedium} height={theme.selfcommunity.user.avatar.sizeMedium} />}
        title={<Skeleton animation="wave" variant="rectangular" width={60} height={20} />}
      />
      <CardContent className={messageClasses.title}>
        <React.Fragment>
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </CardContent>
      <Box className={messageClasses.media}>
        <Skeleton height={190} animation="wave" variant="rectangular" />
      </Box>
      <CardContent className={messageClasses.content}>
        <React.Fragment>
          <Skeleton animation="wave" height={10} width="80%" />
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

/**
 * > API documentation for the Community-JS Broadcast Messages Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BroadcastMessagesSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBroadcastMessagesSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessagesSkeleton-root|Styles applied to the root element.|
 *
 */
export default function BroadcastMessagesSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
    </Root>
  );
}
