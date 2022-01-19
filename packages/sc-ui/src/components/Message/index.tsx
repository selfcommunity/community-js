import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemText, CardProps, Typography, Box} from '@mui/material';
import SnippetMessageBoxSkeleton from '../Skeleton/SnippetMessageBoxSkeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageType} from '@selfcommunity/core';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const PREFIX = 'SCMessage';

const classes = {
  card: `${PREFIX}-card`,
  selected: `${PREFIX}-selected`,
  info: `${PREFIX}-info`,
  messageBox: `${PREFIX}-messageBox`,
  messageTime: `${PREFIX}-messageTime`,
  unread: `${PREFIX}-unread`,
  hide: `${PREFIX}-hide`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.card}`]: {
    padding: '0px'
  },
  [`& .${classes.info}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  [`& .${classes.messageBox}`]: {
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
}

export default function Message(props: MessageProps): JSX.Element {
  // PROPS
  const {id = null, autoHide = false, message = null, className = null, snippetType = true, unseen = null, ...rest} = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders snippet or thread type message object
   */
  const c = (
    <React.Fragment>
      {message ? (
        <ListItem button={true}>
          {snippetType ? (
            <React.Fragment>
              <ListItemAvatar>
                <Avatar alt={message.receiver.username} src={message.receiver.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box className={classes.info}>
                    <Typography component="span">{message.receiver.username}</Typography>
                    <Typography component="span">{`${intl.formatDate(message.last_message_at, {
                      weekday: 'long',
                      day: 'numeric'
                    })}`}</Typography>
                  </Box>
                }
                secondary={
                  <Box className={classes.info}>
                    <Typography component="span"> {message.headline}</Typography>
                    <FiberManualRecordIcon fontSize="small" className={unseen ? classes.unread : classes.hide} />
                  </Box>
                }
              />
            </React.Fragment>
          ) : (
            <ListItemText
              primary={
                <Box className={classes.messageBox}>
                  <Typography component="span">{message.message}</Typography>
                </Box>
              }
              secondary={
                <Box className={classes.messageTime}>
                  <Typography component="span">{`${intl.formatDate(message.created_at, {
                    hour: 'numeric',
                    minute: 'numeric'
                  })}`}</Typography>
                </Box>
              }
            />
          )}
        </ListItem>
      ) : (
        <SnippetMessageBoxSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={className} {...rest}>
        <CardContent className={classes.card}>
          <List>{c}</List>
        </CardContent>
      </Root>
    );
  }
  return null;
}
