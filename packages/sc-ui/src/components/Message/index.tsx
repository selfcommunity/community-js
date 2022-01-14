import React from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemText, CardProps, Typography, Box} from '@mui/material';
import MessageBoxSkeleton from '../Skeleton/MessageBoxSkeleton';
import {SCPrivateMessageType} from '@selfcommunity/core';
import {useIntl} from 'react-intl';

const PREFIX = 'SCMessage';

const classes = {
  info: `${PREFIX}-info`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.info}`]: {
    display: 'flex',
    justifyContent: 'space-between'
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
   * Function fired when message obj is clicked.
   */
  onClick?: () => void;
}

export default function Message(props: MessageProps): JSX.Element {
  // PROPS
  const {id = null, autoHide = false, message = null, className = null, ...rest} = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders Message object
   */
  const c = (
    <React.Fragment>
      {message ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={message.receiver.username} src={message.receiver.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box className={classes.info}>
                <Typography>{message.receiver.username}</Typography>
                <Typography variant="body2">{`${intl.formatDate(Date.parse(message.last_message_at), {
                  weekday: 'long',
                  day: 'numeric'
                })}`}</Typography>
              </Box>
            }
            secondary={message.headline}
          />
        </ListItem>
      ) : (
        <MessageBoxSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={className} {...rest}>
        <CardContent>
          <List>{c}</List>
        </CardContent>
      </Root>
    );
  }
  return null;
}
