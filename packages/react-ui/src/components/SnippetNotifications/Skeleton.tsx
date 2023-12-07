import React from 'react';
import {styled} from '@mui/material/styles';
import {List, ListItem, useTheme} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import NotificationItem from '../../shared/NotificationItem';
import {SCNotificationObjectTemplateType} from '../../types/notification';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`,
  item: `${PREFIX}-item`
};

const Root = styled(List, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Snippet Notification Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SnippetNotificationsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCSnippetNotification-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippetNotification-skeleton-root|Styles applied to the root element.|
 |item|.SCSnippetNotification-item|Styles applied to the item element.|
 *
 */
export default function SnippetNotificationSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();

  const notificationSkeleton = (
    <NotificationItem
      className={classes.item}
      template={SCNotificationObjectTemplateType.SNIPPET}
      image={
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeSmall}
          height={theme.selfcommunity.user.avatar.sizeSmall}
        />
      }
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
    />
  );
  return (
    <Root className={classes.root} {...props}>
      {[...Array(7)].map((x, i) => (
        <ListItem className={classes.item} key={i}>
          {notificationSkeleton}
        </ListItem>
      ))}
    </Root>
  );
}
