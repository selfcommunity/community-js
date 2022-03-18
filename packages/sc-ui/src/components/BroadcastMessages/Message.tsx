import React, {useContext, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, CardContent, CardHeader, CardMedia, CardProps, Chip, CircularProgress, Fade, IconButton, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import MarkRead from '../../shared/MarkRead';
import Widget from '../Widget';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCBroadcastMessageBannerType,
  SCBroadcastMessageType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType
} from '@selfcommunity/core';

const PREFIX = 'SCBroadcastMessage';

const classes = {
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  media: `${PREFIX}-media`,
  content: `${PREFIX}-content`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  [`& .${classes.header} .MuiAvatar-img`]: {
    objectFit: 'fill'
  }
}));

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
   * Any other properties
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.LOGO_NAVBAR_LOGO, SCPreferences.TEXT_APPLICATION_NAME];

export default function Message(props: MessageProps): JSX.Element {
  // PROPS
  const {id = `message_${props.message.id}`, className, message, onClose = null, onRead = null, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(message.disposed_at === null);
  const [closing, setClosing] = useState<boolean>(false);

  // Context
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);

  // Compute preferences
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPrefernces.preferences ? scPrefernces.preferences[p].value : null));
    return _preferences;
  }, [scPrefernces.preferences]);

  // HANDLERS
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
        onClose && onClose(message);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      })
      .then(() => setClosing(false));
  };

  // RENDER
  const renderContent = (banner) => {
    switch (banner.type_banner) {
      case SCBroadcastMessageBannerType.NOTIFICATION:
        return (
          <>
            <CardContent className={classes.title}>
              <Typography variant="h6">{banner.title}</Typography>
            </CardContent>
            {banner.image && <CardMedia className={classes.media} component="img" image={banner.image} alt={banner.title} />}
            <CardContent className={classes.content}>
              <Typography variant="body2" color="text.secondary">
                {banner.body_text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Link to={banner.link} target={banner.open_in_new_tab ? '_blank' : '_self'}>
                  {banner.link_text}
                </Link>
              </Typography>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };
  // Banner
  const {banner} = message;

  return (
    <Fade in={open} unmountOnExit>
      <Root id={id} className={className} {...rest}>
        {message.viewed_at === null && <MarkRead endpoint={Endpoints.BroadcastMessagesMarkRead} data={{banner_ids: [message.id]}} />}
        <CardHeader
          className={classes.header}
          avatar={<Avatar alt={preferences[SCPreferences.TEXT_APPLICATION_NAME]} src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} />}
          action={
            <IconButton aria-label="close" onClick={handleClose} disabled={closing}>
              {closing ? <CircularProgress size={20} /> : <Icon>close</Icon>}
            </IconButton>
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
      </Root>
    </Fade>
  );
}
