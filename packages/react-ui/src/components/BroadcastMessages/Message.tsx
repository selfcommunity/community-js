import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  CardMedia,
  CardProps,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import MarkRead from '../../shared/MarkRead';
import Widget from '../Widget';
import {SCBroadcastMessageTemplateType} from '../../types';
import classNames from 'classnames';
import {SCBroadcastMessageType} from '@selfcommunity/types';
import {http, Endpoints} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  Link,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCRouting
} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-message-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  media: `${PREFIX}-media`,
  content: `${PREFIX}-content`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  messageIconWrap: `${PREFIX}-flag-icon-wrap`,
  messageIconSnippet: `${PREFIX}-flag-icon-snippet`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'MessageRoot'
})(() => ({}));

export interface MessageProps extends CardProps {
  /**
   * Id of the Message
   * @default 'message_<id>'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Banner of the message
   */
  message: SCBroadcastMessageType;

  /**
   * Bypass mark read message
   * @default false
   */
  disableMarkRead?: boolean;

  /**
   * Handler triggered when message is closed
   * @default null
   */
  onClose?: (message: SCBroadcastMessageType) => void;

  /**
   * Handler triggered when message is readed
   * @default null
   */
  onRead?: (message: SCBroadcastMessageType) => void;

  /**
   * Template type
   * @default 'preview'
   */
  template?: SCBroadcastMessageTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.LOGO_NAVBAR_LOGO_MOBILE, SCPreferences.TEXT_APPLICATION_NAME];

export default function Message(props: MessageProps): JSX.Element {
  // PROPS
  const {
    id = `message_${props.message.id}`,
    className,
    message,
    disableMarkRead = false,
    onClose = null,
    onRead = null,
    template = SCBroadcastMessageTemplateType.DETAIL,
    ...rest
  } = props;

  // STATE
  const [open, setOpen] = useState<boolean>(message.disposed_at === null);
  const [closing, setClosing] = useState<boolean>(false);

  // CONTEXT
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // Compute preferences
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPrefernces.preferences ? scPrefernces.preferences[p].value : null));
    return _preferences;
  }, [scPrefernces.preferences]);

  // HANDLERS
  /**
   * Handle dispose message
   */
  const handleClose = () => {
    setClosing(true);
    http
      .request({
        url: Endpoints.BroadcastMessagesDispose.url(),
        method: Endpoints.BroadcastMessagesDispose.method,
        data: {
          banner_ids: [message.id]
        }
      })
      .then(() => {
        setOpen(false);
        setClosing(false);
        onClose && onClose(message);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * Handle on read message
   * @param res
   */
  const handleOnRead = (res) => {
    if (res.status < 300) {
      onRead && onRead(message);
    }
  };

  useEffect(() => {
    setOpen(message.disposed_at === null);
  }, [message]);

  // RENDER
  const renderContent = (banner) => {
    return (
      <>
        <CardContent className={classes.title}>
          <Typography variant="h6">{banner.title}</Typography>
        </CardContent>
        {banner.image && <CardMedia className={classes.media} component="img" image={banner.image} alt={banner.title} />}
        {(banner.body_text || banner.link_text) && (
          <CardContent className={classes.content}>
            {banner.body_text && (
              <Typography variant="body1" color="text.secondary">
                {banner.body_text}
              </Typography>
            )}
            {banner.link_text && (
              <Typography variant="body1" color="text.secondary">
                <a href={banner.link} target={banner.open_in_new_tab ? '_blank' : '_self'}>
                  {banner.link_text}
                </a>
              </Typography>
            )}
          </CardContent>
        )}
      </>
    );
  };

  // Banner
  const {banner} = message;

  if (template === SCBroadcastMessageTemplateType.DETAIL || SCBroadcastMessageTemplateType.TOAST) {
    /**
     * With a fade in transition show the Card (Widget)
     * Include also MarkRead component to
     */
    return (
      <Root id={id} className={classNames(classes.root, className)} {...rest}>
        <Fade in={open} unmountOnExit>
          <Box>
            {message.viewed_at === null && !disableMarkRead && (
              <MarkRead endpoint={Endpoints.BroadcastMessagesMarkRead} data={{banner_ids: [message.id]}} callback={handleOnRead} />
            )}
            <CardHeader
              className={classes.header}
              avatar={<Avatar alt={preferences[SCPreferences.TEXT_APPLICATION_NAME]} src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} />}
              action={
                template === SCBroadcastMessageTemplateType.DETAIL && (
                  <IconButton aria-label="close" onClick={handleClose} disabled={closing}>
                    {closing ? <CircularProgress size={20} /> : <Icon>close</Icon>}
                  </IconButton>
                )
              }
              title={
                <Chip
                  color="secondary"
                  size="small"
                  label={<FormattedMessage id="ui.broadcastMessages.message.chip" defaultMessage="ui.broadcastMessages.message.chip" />}
                />
              }
            />
            {renderContent(banner)}
          </Box>
        </Fade>
      </Root>
    );
  }

  // SCBroadcastMessageTemplateType.SNIPPET
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem
        alignItems={'center'}
        component={'div'}
        classes={{
          root: classNames(classes.listItemSnippet, classes.listItemSnippetNew)
        }}>
        <ListItemAvatar classes={{root: classes.messageIconWrap}}>
          <Avatar variant="circular" classes={{root: classes.messageIconSnippet}}>
            <Icon>info</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Link to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}>
              <Typography component="span" color="inherit">
                {banner.title}
              </Typography>
            </Link>
          }
        />
      </ListItem>
    </Root>
  );
}
