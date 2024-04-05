import React, {useContext, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, ListItemButton, ListItemAvatar, ListItemText, Typography, Chip, ListItem} from '@mui/material';
import PrivateMessageSnippetItemSkeleton from './Skeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageSnippetType, SCPrivateMessageStatusType} from '@selfcommunity/types';
import {SCUserContextType, SCUserContext, SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import UserAvatar from '../../shared/UserAvatar';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  username: `${PREFIX}-username`,
  badgeLabel: `${PREFIX}-badge-label`,
  time: `${PREFIX}-time`,
  menuItem: `${PREFIX}-menu-item`,
  unread: `${PREFIX}-unread`
};

const Root = styled(ListItem, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const PREFERENCES = [SCPreferences.STAFF_STAFF_BADGE_LABEL, SCPreferences.STAFF_STAFF_BADGE_ICON];
export interface PrivateMessageSnippetItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * PrivateMessageItem Object
   * @default null
   */
  message?: SCPrivateMessageSnippetType;

  /**
   * Callback fired on item click
   */
  onItemClick?: () => void;

  /**
   * Item secondary action (visible only on mobile view)
   */
  secondaryAction?: React.ReactNode;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PrivateMessageSnippetItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippetItem} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippetItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippetItem-root|Styles applied to the root element.|
 |username|.SCPrivateMessageSnippetItem-username|Styles applied to the username element.|
 |badgeLabel|.SCPrivateMessageSnippetItem-badgeLabel|Styles applied to the badgeLabel element.|
 |time|.SCPrivateMessageSnippetItem-time|Styles applied to the time element.|
 |menuItem|.SCPrivateMessageSnippetItem-menu-item|Styles applied to the menu item element.|
 |unread|.SCPrivateMessageSnippetItem-unread|Styles applied to snippet item if there's an unread message.|

 * @param inProps
 */
export default function PrivateMessageSnippetItem(inProps: PrivateMessageSnippetItemProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSnippetItemProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {message = null, className = null, onItemClick = null, secondaryAction = null, ...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // INTL
  const intl = useIntl();

  // STATE
  const hasBadge = () => {
    if (message.receiver) {
      if (message?.receiver.id !== scUserContext?.user?.id) {
        return message?.receiver.community_badge;
      }
      return message?.sender.community_badge;
    }
  };

  if (!message) {
    return <PrivateMessageSnippetItemSkeleton elevation={0} />;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest} secondaryAction={secondaryAction} disablePadding>
      <ListItemButton
        onClick={onItemClick}
        classes={{root: classNames({[classes.unread]: message.thread_status === SCPrivateMessageStatusType.NEW})}}>
        <ListItemAvatar>
          <UserAvatar hide={!hasBadge()}>
            {message.group ? (
              <Avatar alt={message.group.name} src={message.group.image_big} />
            ) : (
              <Avatar
                alt={scUserContext?.user?.username === message.receiver.username ? message.sender.username : message.receiver.username}
                src={scUserContext?.user?.username === message.receiver.username ? message.sender.avatar : message.receiver.avatar}
              />
            )}
          </UserAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography component="span" className={classes.username}>
                {message.group
                  ? message.group.name
                  : scUserContext?.user?.username === message.receiver.username
                  ? message.sender.username
                  : message.receiver.username}
              </Typography>
              {hasBadge() && preferences && (
                <Chip component="span" className={classes.badgeLabel} size="small" label={preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]} />
              )}
              <Typography color="secondary" className={classes.time} component="span">{`${intl.formatDate(message.last_message_at, {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })}`}</Typography>
            </>
          }
          secondary={
            <>
              <Typography component="span" color="text.secondary" dangerouslySetInnerHTML={{__html: message.headline ?? message.message}} />
            </>
          }
        />
      </ListItemButton>
    </Root>
  );
}
