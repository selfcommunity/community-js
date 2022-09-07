import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Box, useTheme, useMediaQuery, Typography} from '@mui/material';
import {ConfirmDialog, Snippets} from '@selfcommunity/react-ui';
import {Thread} from '@selfcommunity/react-ui';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PrivateMessageService} from '@selfcommunity/api-services';

const PREFIX = 'SCPrivateMessagesTemplate';

const classes = {
  root: `${PREFIX}-root`,
  snippetsBox: `${PREFIX}-snippets-box`,
  threadBox: `${PREFIX}-thread-box`,
  newMessage: `${PREFIX}-new-message`,
  selected: `${PREFIX}-selected`,
  desktopLayout: `${PREFIX}-desktop-layout`,
  snippetsMobileLayout: `${PREFIX}-snippets-mobile-layout`,
  threadMobileLayout: `${PREFIX}-thread-mobile-layout`,
  deleteSection: `${PREFIX}-delete-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.desktopLayout}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  [`& .${classes.snippetsBox}`]: {
    position: 'relative',
    ['& .MuiList-root']: {
      '&:last-child': {
        paddingBottom: '24px'
      }
    }
  },
  [`& .${classes.newMessage}`]: {
    width: '100%',
    justifyContent: 'flex-start',
    '& .MuiIcon-root': {
      marginRight: '5px'
    }
  },
  [`& .${classes.selected}`]: {
    background: theme.palette.grey['A200'],
    justifyContent: 'flex-start',
    width: '100%',
    '& .MuiIcon-root': {
      marginRight: '5px'
    }
  },
  [`& .${classes.deleteSection}`]: {
    display: 'flex',
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    justifyContent: 'center'
  },
  [`& .${classes.threadMobileLayout}`]: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

export interface PrivateMessagesProps {
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
   * Any other properties
   */
  [p: string]: any;
}
/**
 *
 > API documentation for the Community-JS Private Messages template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessages} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCPrivateMessagesTemplate` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessagesTemplate-root|Styles applied to the root element.|
 |desktopLayout|.SCPrivateMessagesTemplate-desktop-layout|Styles applied when using desktop view.|
 |mobileLayout|.SCPrivateMessagesTemplate-mobile-layout|Styles applied when using mobile view.|
 |newMessage|.SCPrivateMessagesTemplate-new-message|Styles applied to the new message element.|
 |selected|.SCPrivateMessagesTemplate-selected|Styles applied to the selected element.|
 |snippetsBox|.SCPrivateMessagesTemplate-snippets-box|Styles applied to the snippets box element.|
 |threadBox|.SCPrivateMessagesTemplate-thread-box|Styles applied to the thread box element.|
 |deleteSection|.SCPrivateMessagesTemplate-delete-section|Styles applied to the delete thread section.|


 * @param inProps
 */
export default function PrivateMessages(inProps: PrivateMessagesProps): JSX.Element {
  //PROPS
  const props: PrivateMessagesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = false, className = null, ...rest} = props;

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState(null);
  const [data, setData] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [clickedDelete, setClickedDelete] = useState<boolean>(false);
  const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //  HANDLERS
  const handleThreadOpening = (i) => {
    setObj(i);
    setOpenNewMessage(false);
    if (isMobile) {
      setLayout('mobile');
    }
  };

  const handleOpenNewMessage = () => {
    setOpenNewMessage(!openNewMessage);
    setObj(null);
    if (isMobile) {
      setLayout('mobile');
    }
  };

  const handleSnippetsUpdate = (data) => {
    setData(data.message);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteThreadDialog(false);
    setClickedDelete(false);
  };

  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    PrivateMessageService.deleteAThread(obj.id)
      .then(() => {
        setOpenDeleteThreadDialog(false);
        setClickedDelete(false);
        setShouldUpdate(true);
        setObj(null);
      })
      .catch((error) => {
        setOpenDeleteThreadDialog(false);
        console.log(error);
      });
  }

  /**
   * Handles thread selection for delete action
   */
  function handleThreadToDelete(i) {
    setOpenDeleteThreadDialog(true);
    setObj(i);
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {isMobile ? (
          <Box className={classes.snippetsMobileLayout}>
            {layout === 'default' && (
              <>
                <Button className={openNewMessage ? classes.selected : classes.newMessage} onClick={handleOpenNewMessage}>
                  <Icon>add_circle_outline</Icon>
                  <FormattedMessage id="templates.privateMessages.button.new" defaultMessage="templates.privateMessages.button.new" />
                </Button>
                <Snippets onSnippetClick={handleThreadOpening} threadId={obj ? obj.id : null} getSnippetHeadline={data} shouldUpdate={shouldUpdate} />
              </>
            )}
            {layout === 'mobile' && (
              <Box className={classes.threadMobileLayout}>
                <Thread
                  threadObj={obj ? obj : null}
                  openNewMessage={openNewMessage}
                  onNewMessageSent={openNewMessage ? setObj : null}
                  onMessageSent={handleSnippetsUpdate}
                  shouldUpdate={setShouldUpdate}
                  onMessageBack={setLayout}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box className={classes.desktopLayout}>
            <Box className={classes.snippetsBox}>
              {clickedDelete ? (
                <Typography component="h4" align="center" sx={{backgroundColor: theme.palette.primary.main, textTransform: 'upperCase'}}>
                  <FormattedMessage id="templates.privateMessages.delete" defaultMessage="templates.privateMessages.delete" />
                </Typography>
              ) : (
                <Button className={openNewMessage ? classes.selected : classes.newMessage} onClick={handleOpenNewMessage}>
                  <Icon>add_circle_outline</Icon>
                  <FormattedMessage id="templates.privateMessages.button.new" defaultMessage="templates.privateMessages.button.new" />
                </Button>
              )}
              <Snippets
                onSnippetClick={clickedDelete ? handleThreadToDelete : handleThreadOpening}
                threadId={obj ? obj.id : null}
                getSnippetHeadline={data}
                shouldUpdate={shouldUpdate}
              />
              <Box className={classes.deleteSection}>
                {clickedDelete ? (
                  <Icon onClick={() => setClickedDelete(false)}>close</Icon>
                ) : (
                  <Icon onClick={() => setClickedDelete(true)}>delete</Icon>
                )}
              </Box>
            </Box>
            <Box className={classes.threadBox}>
              <Thread
                threadObj={obj ? obj : null}
                openNewMessage={openNewMessage}
                onNewMessageSent={openNewMessage ? setObj : null}
                onMessageSent={handleSnippetsUpdate}
                shouldUpdate={setShouldUpdate}
              />
            </Box>
          </Box>
        )}
        {openDeleteThreadDialog && (
          <ConfirmDialog
            open={openDeleteThreadDialog}
            title={<FormattedMessage id="ui.delete.thread.message.dialog.msg" defaultMessage="ui.delete.thread.message.dialog.msg" />}
            btnConfirm={<FormattedMessage id="ui.thread.message.dialog.confirm" defaultMessage="ui.thread.message.dialog.confirm" />}
            onConfirm={() => handleDeleteThread()}
            onClose={handleCloseDeleteDialog}
          />
        )}
      </Root>
    );
  }
  return null;
}
