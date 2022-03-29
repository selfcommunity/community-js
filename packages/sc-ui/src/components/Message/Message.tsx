import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Avatar, ListItem, ListItemAvatar, ListItemText, CardProps, Typography, Box, IconButton, Button} from '@mui/material';
import MessageSkeleton from './Skeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageType, SCMessageFileType, SCUserContextType, SCUserContext} from '@selfcommunity/core';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import Widget from '../Widget';
import AutoPlayer from '../../shared/AutoPlayer';
import LazyLoad from 'react-lazyload';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCMessage';

const classes = {
  root: `${PREFIX}-root`,
  selected: `${PREFIX}-selected`,
  info: `${PREFIX}-info`,
  messageBox: `${PREFIX}-messageBox`,
  messageTime: `${PREFIX}-messageTime`,
  unread: `${PREFIX}-unread`,
  hide: `${PREFIX}-hide`,
  img: `${PREFIX}-img`,
  downloadButton: `${PREFIX}-downloadButton`,
  documentFile: `${PREFIX}-documentFile`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.info}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  [`& .${classes.messageBox}`]: {
    margin: 'auto',
    padding: '16px',
    borderRadius: '20px'
  },
  [`& .${classes.messageTime}`]: {
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [`& .${classes.unread}`]: {
    width: '0.8rem',
    fill: 'blue'
  },
  [`& .${classes.hide}`]: {
    display: 'none'
  },
  [`& .${classes.img}`]: {
    width: 250,
    height: 200
  },
  [`& .${classes.downloadButton}`]: {
    backgroundColor: theme.palette.common.white,
    marginBottom: '5px'
  },
  [`& .${classes.documentFile}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export interface MessageProps extends Pick<CardProps, Exclude<keyof CardProps, 'id'>> {
  /**
   * Id of message object
   * @default null
   */
  id?: number;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Message Object
   * @default null
   */
  message?: SCPrivateMessageType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * The message type. If true, it shows snippet type structure, otherwise it shows thread message structure;
   * @default true
   */
  snippetType?: boolean;
  /**
   * The message status. If true, shows a dot next to message headline.
   * @default null
   */
  unseen?: boolean;
  /**
   * Callback fired on mouse hover
   * @default null
   */
  onMouseEnter?: () => void;
  /**
   * Callback fired on mouse leave
   * @default null
   */
  onMouseLeave?: () => void;
  /**
   * Gets mouse hovering status
   * @default null
   */
  isHovering?: () => void;
  /**
   * Id of the logged user
   * @default null
   */
  loggedUser?: number;
  /**
   * Action triggered on delete icon click
   * @default null
   */
  onDeleteIconClick?: () => void;
}

/**
 *
 > API documentation for the Community-UI Message component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Message} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCMessage` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCMessage-root|Styles applied to the root element.|
 |selected|.SCMessage-selected|Styles applied to the selected element.|
 |info|.SCMessage-info|Styles applied to the info section.|
 |messageBox|.SCMessage-messageBox|Styles applied to the message box element.|
 |messageTime|.SCMessage-messageTime|Styles applied to the message time element.|
 |unread|.SCMessage-unread|Styles applied to the unread element.|
 |hide|.SCMessage-hide|Styles applied to the hidden element.|
 |img|.SCMessage-img|Styles applied to the img element.|
 |downloadButton|.SCMessage-downloadButton|Styles applied to the download button element.|
 |documentFile|.SCMessage-documentFile|Styles applied to the message file element.|


 * @param inProps
 */
export default function Message(inProps: MessageProps): JSX.Element {
  // PROPS
  const props: MessageProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = null,
    autoHide = false,
    message = null,
    className = null,
    snippetType = true,
    unseen = null,
    onMouseEnter = null,
    onMouseLeave = null,
    isHovering = null,
    loggedUser = null,
    onDeleteIconClick = null,
    ...rest
  } = props;

  // INTL
  const intl = useIntl();

  // STATE
  const hasFile = message ? message.file : null;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  if (!message) {
    return <MessageSkeleton elevation={0} />;
  }

  function bytesToSize(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  }

  // RENDERING

  const renderMessageFile = (m) => {
    if (!m) {
      return null;
    }
    let section = null;
    if (m.file) {
      let type = m.file.mimetype;
      let isPdf = type === 'application/pdf';
      let src = message.file.url;
      switch (true) {
        case type.startsWith(SCMessageFileType.IMAGE):
          section = (
            <Box className={classes.img}>
              <img style={{height: '100%', width: '100%'}} src={src} loading="lazy" alt={'img'} />
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.VIDEO):
          section = (
            <Box>
              <AutoPlayer url={src} width={'100%'} />
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.DOCUMENT):
          section = (
            <>
              {isPdf ? (
                <iframe src={`https://docs.google.com/gview?url=${src}&embedded=true`} title="file" width="100%" height="200" loading="eager" />
              ) : (
                <>
                  <Box className={classes.documentFile}>
                    <IconButton className={classes.downloadButton} onClick={() => window.open(src, '_blank')}>
                      <Icon>download</Icon>
                    </IconButton>
                    <Typography sx={{marginLeft: '5px'}}>{m.file.filename}</Typography>
                  </Box>
                  <Typography component={'span'}>{bytesToSize(m.file.filesize)}</Typography>
                </>
              )}
            </>
          );
          break;
        default:
          section = <Icon>hide_image</Icon>;
          break;
      }
    }
    return <React.Fragment>{section}</React.Fragment>;
  };

  /**
   * Renders snippet or thread type message object
   */
  const c = (
    <React.Fragment>
      {snippetType ? (
        <React.Fragment>
          <ListItem>
            <ListItemAvatar>
              {scUserContext['user'] && scUserContext['user'].username === message.receiver.username ? (
                <Avatar alt={message.sender.username} src={message.sender.avatar} />
              ) : (
                <Avatar alt={message.receiver.username} src={message.receiver.avatar} />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box className={classes.info}>
                  {scUserContext['user'] && scUserContext['user'].username === message.receiver.username ? (
                    <Typography component="span">{message.sender.username}</Typography>
                  ) : (
                    <Typography component="span">{message.receiver.username}</Typography>
                  )}
                  <Typography component="span">{`${intl.formatDate(message.last_message_at, {
                    weekday: 'long',
                    day: 'numeric'
                  })}`}</Typography>
                </Box>
              }
              secondary={
                <Box component="span" className={classes.info}>
                  <Typography component="span"> {message.headline}</Typography>
                  <Icon fontSize="small" className={unseen ? classes.unread : classes.hide}>
                    fiber_manual_record
                  </Icon>
                </Box>
              }
            />
          </ListItem>
        </React.Fragment>
      ) : (
        <LazyLoad once>
          <ListItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} button={true}>
            {!snippetType && isHovering && loggedUser === message.sender_id && message.status !== 'hidden' && (
              <>
                <IconButton sx={{marginBottom: '25px'}} onClick={onDeleteIconClick}>
                  <Icon fontSize="small">delete</Icon>
                </IconButton>
              </>
            )}
            <ListItemText
              primary={
                <Box className={classes.messageBox}>
                  {hasFile ? renderMessageFile(message) : <Typography component="span" dangerouslySetInnerHTML={{__html: message.message}} />}
                </Box>
              }
              secondary={
                <Box component="span" className={classes.messageTime}>
                  <Typography component="span">{`${intl.formatDate(message.created_at, {
                    hour: 'numeric',
                    minute: 'numeric'
                  })}`}</Typography>
                </Box>
              }
            />
          </ListItem>
        </LazyLoad>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        <List>{c}</List>
      </Root>
    );
  }
  return null;
}
