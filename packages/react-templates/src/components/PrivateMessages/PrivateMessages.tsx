import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useTheme, useMediaQuery} from '@mui/material';
import {ConfirmDialog, PrivateMessageSnippets} from '@selfcommunity/react-ui';
import {PrivateMessageThread} from '@selfcommunity/react-ui';
import {FormattedMessage} from 'react-intl';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PrivateMessageService} from '@selfcommunity/api-services';
import {SCPrivateMessageThreadType} from '@selfcommunity/types';

const PREFIX = 'SCPrivateMessagesTemplate';

const classes = {
  root: `${PREFIX}-root`,
  snippetsBox: `${PREFIX}-snippets-box`,
  threadBox: `${PREFIX}-thread-box`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessagesProps {
  /**
   * Thread receiver id
   * @default null
   */
  id?: number | string;
  /**
   * Handler on message click
   * @default null
   */
  onItemClick?: (id) => void;
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
 |snippetsBox|.SCPrivateMessagesTemplate-snippets-box|Styles applied to the snippets box element.|
 |threadBox|.SCPrivateMessagesTemplate-thread-box|Styles applied to the thread box element.|

 * @param inProps
 */
export default function PrivateMessages(inProps: PrivateMessagesProps): JSX.Element {
  //PROPS
  const props: PrivateMessagesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, autoHide = false, className = null, onItemClick = null, ...rest} = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState<any>(id ?? null);
  const [snippetData, setSnippetData] = useState(null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [deletedThread, setDeletedThread] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);
  const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState<boolean>(false);
  const mobileSnippetsView = (layout === 'default' && !id) || (layout === 'mobile' && id);
  const mobileThreadView = (layout === 'mobile' && !id) || (layout === 'default' && id);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //  HANDLERS
  const handleThreadOpening = (i) => {
    onItemClick && onItemClick(i.id);
    setObj(i);
    setOpenNewMessage(false);
    isMobile && setLayout('mobile');
    id && setLayout('default');
  };

  const handleOpenNewMessage = () => {
    setOpenNewMessage(!openNewMessage);
    setObj(null);
    isMobile && setLayout('mobile');
    id && setLayout('default');
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteThreadDialog(false);
  };

  const handleMessageBack = () => {
    setLayout('default');
    id && setLayout('mobile');
    setOpenNewMessage(false);
  };

  const handleSnippetsUpdate = (message: SCPrivateMessageThreadType) => {
    setDeletedThread(null);
    setSnippetData(message);
    if (openNewMessage) {
      setObj(message);
      setOpenNewMessage(false);
    }
  };
  /**
   * Handles thread selection for delete action
   */
  function handleThreadToDelete(threadObj) {
    setOpenDeleteThreadDialog(true);
    setDeletingThread(threadObj.id);
  }
  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    PrivateMessageService.deleteAThread(deletingThread ?? obj.id)
      .then(() => {
        if (layout === 'mobile') {
          setLayout('default');
        }
        id && setLayout('mobile');
        setOpenDeleteThreadDialog(false);
        setDeletedThread(deletingThread ?? obj.id);
        deletingThread === obj?.id && setObj(null);
        setSnippetData(null);
      })
      .catch((error) => {
        setOpenDeleteThreadDialog(false);
        console.log(error);
      });
  }

  /**
   * Renders snippets section
   */
  function renderSnippets() {
    return (
      <Grid item xs={12} md={5} className={classes.snippetsBox}>
        <PrivateMessageSnippets
          snippetActions={{
            onSnippetClick: handleThreadOpening,
            onNewMessageClick: handleOpenNewMessage,
            onMenuItemClick: handleThreadToDelete
          }}
          snippetCallbacksData={{onMessageChanges: snippetData, onDeleteThreadSuccess: deletedThread}}
          threadId={id ?? obj?.id ?? null}
          //selected={obj}
        />
        {openDeleteThreadDialog && (
          <ConfirmDialog
            open={openDeleteThreadDialog}
            title={
              <FormattedMessage
                id="templates.privateMessages.delete.thread.dialog.msg"
                defaultMessage="templates.privateMessages.delete.thread.dialog.msg"
              />
            }
            btnConfirm={
              <FormattedMessage
                id="templates.privateMessages.delete.thread.dialog.confirm"
                defaultMessage="templates.privateMessages.delete.thread.dialog.confirm"
              />
            }
            onConfirm={() => handleDeleteThread()}
            onClose={handleCloseDeleteDialog}
          />
        )}
      </Grid>
    );
  }
  /**
   * Renders thread section
   */
  function renderThread() {
    return (
      <Grid item xs={12} md={7} className={classes.threadBox}>
        <PrivateMessageThread
          threadObj={obj ?? null}
          openNewMessage={openNewMessage}
          threadCallbacks={{
            onMessageSentOrDeleted: handleSnippetsUpdate,
            onMessageBack: handleMessageBack
          }}
        />
      </Grid>
    );
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root container {...rest} className={classNames(classes.root, className)}>
        {isMobile ? (
          <>
            {mobileSnippetsView && <>{renderSnippets()}</>}
            {mobileThreadView && <>{renderThread()}</>}
          </>
        ) : (
          <>
            {renderSnippets()}
            {renderThread()}
          </>
        )}
      </Root>
    );
  }
  return null;
}
