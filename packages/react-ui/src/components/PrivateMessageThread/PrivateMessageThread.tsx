import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {UserService} from '@selfcommunity/api-services';
import {
  SCFollowersManagerType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/react-core';
import {SCPrivateMessageFileType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PrivateMessageThreadItem from '../PrivateMessageThreadItem';
import _ from 'lodash';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, CardContent, IconButton, List, ListSubheader, TextField, Typography} from '@mui/material';
import PrivateMessageEditor from '../PrivateMessageEditor';
import Autocomplete from '@mui/material/Autocomplete';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import PrivateMessageThreadSkeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const translMessages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder',
    defaultMessage: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder'
  }
});

const PREFIX = 'SCPrivateMessageThread';

const classes = {
  root: `${PREFIX}-root`,
  subHeader: `${PREFIX}-subheader`,
  section: `${PREFIX}-section`,
  emptyMessage: `${PREFIX}-empty-message`,
  newMessageHeader: `${PREFIX}-new-message-header`,
  newMessageHeaderContent: `${PREFIX}-new-message-header-content`,
  newMessageHeaderIcon: `${PREFIX}-new-message-header-icon`,
  sender: `${PREFIX}-sender`,
  receiver: `${PREFIX}-receiver`,
  autocomplete: `${PREFIX}-autocomplete`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageThreadProps {
  /**
   * Thread object or thread id
   * default null
   */
  threadObj?: any;
  /**
   * Thread receiver
   */
  receiver?: any;
  /**
   * Thread recipients
   */
  recipients?: any;
  /**
   * Loading state
   */
  loadingMessageObjs?: boolean;
  /***
   * Thread messages
   */
  messages?: SCPrivateMessageThreadType[];
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Opens new message screen
   * @default false
   */
  openNewMessage?: boolean;
  /**
   * Opens new message screen
   * @default false
   */
  newMessageThread?: boolean;
  /**
   * Functions called on thread actions
   */
  threadCallbacks?: {
    onMessageBack?: (dispatch: any) => void;
    onMessageDelete?: (msg: SCPrivateMessageThreadType) => void;
    onMessageSend?: (message: string, file: SCPrivateMessageFileType) => void;
    onRecipientSelect?: (event, recipient) => void;
  };
  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 *
 > API documentation for the Community-JS PrivateMessage Thread component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThread} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThread` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThread-root|Styles applied to the root element.|
 |section|.SCPrivateMessageThread-section|Styles applied to the list section|
 |emptyMessage|.SCPrivateMessageThread-empty-message|Styles applied to the empty message element.|
 |newMessageHeader|.SCPrivateMessageThread-new-message-header|Styles applied to the new message header section.|
 |newMessageHeaderIcon|.SCPrivateMessageThread-new-message-header-icon|Styles applied to the new message header icon element.|
 |newMessageHeaderContent|.SCPrivateMessageThread-new-message-header-content|Styles applied to the new message header content.|
 |subHeader|.SCPrivateMessageThread-subheader|Styles applied to thread list subheader element.|
 |sender|.SCPrivateMessageThread-sender|Styles applied to the sender element.|
 |receiver|.SCPrivateMessageThread-receiver|Styles applied to the receiver element.|
 |autocomplete|.SCPrivateMessageThread-autocomplete|Styles applied to new message user insertion autocomplete.|

 * @param inProps
 */
export default function PrivateMessageThread(inProps: PrivateMessageThreadProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    threadObj,
    messages,
    loadingMessageObjs,
    receiver,
    recipients,
    openNewMessage,
    threadCallbacks,
    newMessageThread,
    autoHide,
    className,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // STATE
  const scFollowersManager: SCFollowersManagerType = scUserContext.managers.followers;
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState({});
  const [followers, setFollowers] = useState<any[]>([]);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const isNumber = typeof threadObj === 'number';
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // INTL
  const intl = useIntl();

  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    });

  const formatMessages = (messages) => {
    return _.groupBy(messages, format);
  };

  // CONST
  const formattedMessages = useMemo(() => {
    return formatMessages(messages);
  }, [messages]);

  // HANDLERS
  const handleMouseEnter = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: true};
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: false};
    });
  };

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useMemo(
    () => () => {
      let fetch;
      if (followEnabled) {
        fetch = UserService.getUserFollowers(authUserId);
      } else {
        fetch = UserService.getUserConnections(authUserId);
      }
      return fetch
        .then((data: any) => {
          setFollowers(data.results);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          Logger.error(SCOPE_SC_UI, {error});
        });
    },
    []
  );

  /**
   * Fetches followers when a new message is selected
   */
  useEffect(() => {
    openNewMessage && fetchFollowers();
  }, [openNewMessage, authUserId]);

  /**
   * Checks is thread receiver is a user follower
   */
  useEffect(() => {
    if (receiver) {
      setIsFollower(scFollowersManager.isFollower(receiver));
    }
  });

  /**
   * Renders thread component
   * @return {JSX.Element}
   */
  function renderThread() {
    return (
      <CardContent>
        <List subheader={<li />}>
          {Object.keys(formattedMessages).map((key) => (
            <li key={key} className={classes.section}>
              <ul>
                <ListSubheader>
                  <Typography align="center" className={classes.subHeader}>
                    {key}
                  </Typography>
                </ListSubheader>
                {formattedMessages[key].map((msg: SCPrivateMessageThreadType) => (
                  <PrivateMessageThreadItem
                    className={authUserId === msg.sender.id ? classes.sender : classes.receiver}
                    message={msg}
                    key={msg.id}
                    mouseEvents={{onMouseEnter: () => handleMouseEnter(msg.id), onMouseLeave: () => handleMouseLeave(msg.id)}}
                    isHovering={isHovered[msg.id]}
                    showMenuIcon={authUserId === msg.sender.id}
                    onMenuIconClick={() => threadCallbacks.onMessageDelete(msg)}
                  />
                ))}
              </ul>
            </li>
          ))}
        </List>
        <PrivateMessageEditor send={threadCallbacks.onMessageSend} autoHide={!isFollower} onThreadChangeId={isNumber ? threadObj : threadObj?.id} />
      </CardContent>
    );
  }

  /**
   * Renders empty box (when there is no thread open) or new message box
   * @return {JSX.Element}
   */
  function renderNewOrNoMessageBox() {
    return (
      <CardContent>
        {openNewMessage || newMessageThread ? (
          <>
            <Box className={classes.newMessageHeader}>
              <Box className={classes.newMessageHeaderContent}>
                <Icon className={classes.newMessageHeaderIcon}>person</Icon>
                <Typography>
                  <FormattedMessage defaultMessage="ui.privateMessage.thread.newMessage.to" id="ui.privateMessage.thread.newMessage.to" />
                </Typography>
                <Autocomplete
                  className={classes.autocomplete}
                  loading={loading}
                  multiple={!newMessageThread}
                  limitTags={3}
                  freeSolo
                  options={followers}
                  value={newMessageThread ? (isNumber ? threadObj : threadObj?.receiver.id) : recipients}
                  getOptionLabel={(option) => (option ? option.username : '...')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={`${intl.formatMessage(translMessages.placeholder)}`}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true
                      }}
                    />
                  )}
                  onChange={threadCallbacks.onRecipientSelect}
                  disabled={!followers}
                />
              </Box>
              <IconButton size="small" onClick={threadCallbacks.onMessageBack}>
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Box>
            <PrivateMessageEditor send={threadCallbacks.onMessageSend} autoHide={!followers} />
          </>
        ) : (
          <Typography component="span" className={classes.emptyMessage}>
            <FormattedMessage id="ui.privateMessage.thread.emptyBox.message" defaultMessage="ui.privateMessage.thread.emptyBox.message" />
          </Typography>
        )}
      </CardContent>
    );
  }

  // Anonymous
  if (!authUserId) {
    return <HiddenPlaceholder />;
  }
  if (loadingMessageObjs && threadObj) {
    return <PrivateMessageThreadSkeleton />;
  }
  console.log(threadObj !== null && typeof threadObj !== 'string' && !newMessageThread, 'condizione');
  console.log(threadObj, typeof threadObj, 'threadObj');
  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {threadObj !== null && typeof threadObj !== 'string' && !newMessageThread ? renderThread() : renderNewOrNoMessageBox()}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
