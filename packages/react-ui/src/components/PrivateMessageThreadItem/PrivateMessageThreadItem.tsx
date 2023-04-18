import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {ListItem, Typography, IconButton, Box, useTheme, Button} from '@mui/material';
import PrivateMessageThreadItemSkeleton from './Skeleton';
import {useIntl} from 'react-intl';
import {SCPrivateMessageThreadType, SCMessageFileType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {SCThemeType} from '@selfcommunity/react-core';
import useMediaQuery from '@mui/material/useMediaQuery';
import PrivateMessageSettingsIconButton from '../PrivateMessageSettingsIconButton';
import {bytesToSize} from '../../utils/sizeCoverter';
import BaseDialog from '../../shared/BaseDialog';
import AutoPlayer from '../../shared/AutoPlayer';

const PREFIX = 'SCPrivateMessageThreadItem';
const DIALOG_PREFIX = `${PREFIX}Dialog`;

const classes = {
  root: `${PREFIX}-root`,
  text: `${PREFIX}-text`,
  img: `${PREFIX}-img`,
  document: `${PREFIX}-document`,
  video: `${PREFIX}-video`,
  messageTime: `${PREFIX}-message-time`,
  menuItem: `${PREFIX}-menu-item`
};

const MediaPreviewDialog = styled(BaseDialog, {
  name: DIALOG_PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const hasFile = message ? message.file : null;
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  const handleMenuItemClick = () => {
    onMenuIconClick();
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RENDERING

  const renderMessageFile = (m) => {
    if (!m) {
      return null;
    }
    let section = null;
    if (m.file) {
      let type = m.file.mimetype;
      switch (true) {
        case type.startsWith(SCMessageFileType.IMAGE):
          section = (
            <Box className={classes.img}>
              <img src={m.file.thumbnail} loading="lazy" alt={'img'} onClick={() => setOpenDialog(true)} />
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.VIDEO):
          section = (
            <Box className={classNames(classes.img, classes.video)}>
              <img src={m.file.thumbnail} loading="lazy" alt={'img'} />
              <IconButton onClick={() => setOpenDialog(true)}>
                <Icon>play_circle_outline</Icon>
              </IconButton>
            </Box>
          );
          break;
        case type.startsWith(SCMessageFileType.DOCUMENT):
          section = (
            <Box className={classes.document}>
              <img src={m.file.thumbnail} loading="lazy" alt={'img'} />
              <Button onClick={() => handleDownload(m.file.url, m.file.fileName)}>
                <Icon>download</Icon>
                <Typography>{m.file.filename}</Typography>
                <Typography>{bytesToSize(m.file.filesize)}</Typography>
              </Button>
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
        (isHovering || isMobile) &&
        showMenuIcon &&
        message.status !== 'hidden' && <PrivateMessageSettingsIconButton onMenuItemDeleteClick={handleMenuItemClick} />
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
      {openDialog && (
        <MediaPreviewDialog open={openDialog} onClose={() => setOpenDialog(false)}>
          {message?.file.mimetype.startsWith(SCMessageFileType.VIDEO) ? (
            <AutoPlayer url={message?.file.url} width={'100%'} enableAutoplay={false} />
          ) : (
            <>
              <img src={message?.file.thumbnail} loading="lazy" alt={'img'} />
              <IconButton onClick={() => handleDownload(message?.file.url, message?.file.filename)}>
                <Icon>download</Icon>
              </IconButton>
            </>
          )}
        </MediaPreviewDialog>
      )}
    </Root>
  );
}
