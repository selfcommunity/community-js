import React, {useContext, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, ListItemButton, ListItemAvatar, ListItemText, Typography, Chip, useTheme, ListItem} from '@mui/material';
import PrivateMessageSnippetItemSkeleton from './Skeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageSnippetType} from '@selfcommunity/types';
import {SCUserContextType, SCUserContext, SCPreferences, SCPreferencesContextType, useSCPreferences, SCThemeType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import useMediaQuery from '@mui/material/useMediaQuery';

const PREFIX = 'SCPrivateMessageSnippetItem';

const classes = {
  root: `${PREFIX}-root`,
  username: `${PREFIX}-username`,
  badgeLabel: `${PREFIX}-badge-label`,
  time: `${PREFIX}-time`,
  menuItem: `${PREFIX}-menu-item`
};

const Root = styled(ListItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
   * Hides this component
   * @default false
   */
  autoHide?: boolean;

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
 *
 > API documentation for the Community-JS PrivateMessageSnippetItem component. Learn about the available props and the CSS API.

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

 * @param inProps
 */
export default function PrivateMessageSnippetItem(inProps: PrivateMessageSnippetItemProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSnippetItemProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = false, message = null, className = null, onItemClick = null, secondaryAction = null, ...rest} = props;
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
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isNew = message ? message.thread_status === 'new' : null;
  const hasBadge = message?.receiver.community_badge;

  if (!message) {
    return <PrivateMessageSnippetItemSkeleton elevation={0} />;
  }

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (autoHide) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest} secondaryAction={!isMobile && secondaryAction} disablePadding>
      <ListItemButton onClick={onItemClick}>
        <ListItemAvatar>
          {scUserContext?.user?.username === message.receiver.username ? (
            <Avatar alt={message.sender.username} src={message.sender.avatar} />
          ) : (
            <Avatar alt={message.receiver.username} src={message.receiver.avatar} />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography component="span" className={classes.username}>
                {scUserContext?.user?.username === message.receiver.username ? message.sender.username : message.receiver.username}
              </Typography>
              {hasBadge && preferences && (
                <Chip component="span" className={classes.badgeLabel} size="small" label={preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]} />
              )}
              <Typography color="secondary" className={classes.time} component="span">{`${intl.formatDate(message.last_message_at, {
                weekday: 'long',
                day: 'numeric'
              })}`}</Typography>
            </>
          }
          secondary={
            <>
              <Typography component="span" color="text.secondary" dangerouslySetInnerHTML={{__html: message.headline ?? message.message}} />
              {isNew && (
                <Icon fontSize="small" color="secondary">
                  fiber_manual_record
                </Icon>
              )}
            </>
          }
        />
      </ListItemButton>
    </Root>
  );
}
