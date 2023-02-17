import React from 'react';
import {styled} from '@mui/material/styles';
import {ListItem, Typography, IconButton, Box, Menu, MenuItem, ListItemIcon} from '@mui/material';
import PrivateMessageThreadItemSkeleton from './Skeleton';
import {FormattedMessage, useIntl} from 'react-intl';
import {SCPrivateMessageThreadType, SCMessageFileType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import AutoPlayer from '../../shared/AutoPlayer';
import LazyLoad from 'react-lazyload';
import {DEFAULT_PRELOAD_OFFSET_VIEWPORT} from '../../constants/LazyLoad';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCPrivateMessageThreadItem';

const classes = {
  root: `${PREFIX}-root`,
  text: `${PREFIX}-text`,
  img: `${PREFIX}-img`,
  document: `${PREFIX}-document`,
  video: `${PREFIX}-video`,
  messageTime: `${PREFIX}-message-time`,
  menuItem: `${PREFIX}-menu-item`
};

const Root = styled(ListItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageThreadItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * PrivateMessageItem Object
   * @default null
   */
  message?: SCPrivateMessageThreadType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Mouse Events to spread to the element
   */
  mouseEvents?: {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  /**
   * Gets mouse hovering status
   * @default null
   */
  isHovering?: () => void;
  /**
   * Menu icon showed only for messages sent by logged user
   * @default false
   */
  showMenuIcon?: boolean;
  /**
   * Action triggered on menu icon click
   * @default null
   */
  onMenuIconClick?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS PrivateMessageItem component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThreadItem} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThreadItem` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThreadItem-root|Styles applied to the root element.|
 |text|.SCPrivateMessageThreadItem-text|Styles applied to the message text element.|
 |img|.SCPrivateMessageThreadItem-img|Styles applied to the img element.|
 |document|.SCPrivateMessageThreadItem-document|Styles applied to the message file element.|
 |video|.SCPrivateMessageThreadItem-video|Styles applied to the message video element.|
 |messageTime|.SCPrivateMessageThreadItem-message-time|Styles applied to the thread message time element.|
 |menuItem|.SCPrivateMessageThreadItem-menu-item|Styles applied to the thread message menu item element.|
 
 
 * @param inProps
 */
export default function PrivateMessageThreadItem(inProps: PrivateMessageThreadItemProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadItemProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = false,
    message = null,
    className = null,
    mouseEvents = {},
    isHovering = null,
    showMenuIcon = false,
    onMenuIconClick = null,
    ...rest
  } = props;

  // INTL
  const intl = useIntl();

  // STATE
  const hasFile = message ? message.file : null;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function bytesToSize(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  }
  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = () => {
    onMenuIconClick();
    handleMenuClose();
  };

  // RENDERING

  const renderMessageFile = (m) => {
    if (!m) {
      return null;
    }
    let section = null;
    if (m.file) {
      let type = m.file.mimetype;
      let src = message.file.url;
      switch (true) {
        case type.startsWith(SCMessageFileType.IMAGE):
          section = (
            <Box className={classes.img}>
              <img src={src} loading="lazy" alt={'img'} />
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.VIDEO):
          section = (
            <LazyLoad className={classes.video} once offset={DEFAULT_PRELOAD_OFFSET_VIEWPORT}>
              <AutoPlayer url={src} width={'100%'} />
            </LazyLoad>
          );
          break;
        case type.startsWith(SCMessageFileType.DOCUMENT):
          section = (
            <Box className={classes.document}>
              <IconButton onClick={() => window.open(src, '_blank')}>
                <Icon>download</Icon>
              </IconButton>
              <Typography>{m.file.filename} </Typography>
              <Typography ml={1}>{bytesToSize(m.file.filesize)}</Typography>
            </Box>
          );
          break;
        default:
          section = <Icon>hide_image</Icon>;
          break;
      }
    }
    return <>{section}</>;
  };

  if (!message) {
    return <PrivateMessageThreadItemSkeleton elevation={0} />;
  }
  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (autoHide) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root
      className={classNames(classes.root, className)}
      {...getMouseEvents(mouseEvents.onMouseEnter, mouseEvents.onMouseLeave)}
      {...rest}
      secondaryAction={
        isHovering &&
        showMenuIcon &&
        message.status !== 'hidden' && (
          <>
            <IconButton onClick={handleOpenMenu}>
              <Icon fontSize="small">more_vert</Icon>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem classes={{root: classes.menuItem}} onClick={handleMenuItemClick}>
                <ListItemIcon>
                  <Icon fontSize="small">delete</Icon>
                </ListItemIcon>
                <FormattedMessage id="ui.privateMessage.threadItem.menu.item.delete" defaultMessage="ui.privateMessage.threadItem.menu.item.delete" />
              </MenuItem>
            </Menu>
          </>
        )
      }>
      <>
        {hasFile ? (
          renderMessageFile(message)
        ) : (
          <Box className={classes.text}>
            <Typography component="span" dangerouslySetInnerHTML={{__html: message.message}} />
          </Box>
        )}
        <Typography className={classes.messageTime} color="text.secondary">{`${intl.formatDate(message.created_at, {
          hour: 'numeric',
          minute: 'numeric'
        })}`}</Typography>
      </>
    </Root>
  );
}
