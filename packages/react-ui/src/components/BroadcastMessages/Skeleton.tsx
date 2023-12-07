import React from 'react';
import {Box, CardContent, CardHeader, Skeleton, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const messageClasses = {
  root: `${PREFIX}-message-skeleton-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  media: `${PREFIX}-media`,
  content: `${PREFIX}-content`
};

const MessageSkeletonRoot = styled(Widget, {
  name: PREFIX,
  slot: 'MessageSkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Broadcast Message Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MessageSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBroadcastMessages-message-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessages-message-skeleton-root|Styles applied to the root element.|
 |header|.SCBroadcastMessages-header|Styles applied to the header element.|
 |title|.SCBroadcastMessages-title|Styles applied to the title element.|
 |media|.SCBroadcastMessages-media|Styles applied to the media element.|
 |content|.SCBroadcastMessages-content|Styles applied to the content section.|
 *
 */
export function MessageSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <MessageSkeletonRoot className={messageClasses.root}>
      <CardHeader
        className={messageClasses.header}
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={theme.selfcommunity.user.avatar.sizeMedium}
            height={theme.selfcommunity.user.avatar.sizeMedium}
          />
        }
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
    </MessageSkeletonRoot>
  );
}

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Broadcast Messages Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BroadcastMessagesSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBroadcastMessages-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessages-skeleton-root|Styles applied to the root element.|
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
