import React from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemText, CardProps, Typography, Box} from '@mui/material';
import SnippetMessageBoxSkeleton from '../../Skeleton/SnippetMessageBoxSkeleton';
import {useIntl} from 'react-intl';
import {MessageProps} from '../index';

const PREFIX = 'SCSnippetMessage';

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

export default function SnippetMessage(props: MessageProps): JSX.Element {
  // PROPS
  const {id = null, autoHide = false, message = null, className = null, ...rest} = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders snippet message object
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
                <Typography variant="body2">{`${intl.formatDate(message.last_message_at, {weekday: 'long', day: 'numeric'})}`}</Typography>
              </Box>
            }
            secondary={message.headline}
          />
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
        <CardContent>
          <List>{c}</List>
        </CardContent>
      </Root>
    );
  }
  return null;
}
