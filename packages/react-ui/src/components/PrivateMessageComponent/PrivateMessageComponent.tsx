import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useTheme, useMediaQuery} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCThemeType, SCUserContext, SCUserContextType, UserUtils} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Endpoints, http, HttpResponse, PrivateMessageService} from '@selfcommunity/api-services';
import {
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCPrivateMessageFileType,
  SCPrivateMessageStatusType,
  SCPrivateMessageThreadType
} from '@selfcommunity/types';
import PubSub from 'pubsub-js';
import PrivateMessageThread from '../PrivateMessageThread';
import PrivateMessageSnippets from '../PrivateMessageSnippets';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {useSnackbar} from 'notistack';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCPrivateMessageComponent';

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

export interface PrivateMessageComponentProps {
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
   * Handler on message back
   * @default null
   */
  onMessageBack?: () => void;
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
 import {PrivateMessageComponent} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCPrivateMessageComponent` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageComponent-root|Styles applied to the root element.|
 |snippetsBox|.SCPrivateMessageComponent-snippets-box|Styles applied to the snippets box element.|
 |threadBox|.SCPrivateMessageComponent-thread-box|Styles applied to the thread box element.|

 * @param inProps
 */
export default function PrivateMessageComponent(inProps: PrivateMessageComponentProps): JSX.Element {
  //PROPS
  const props: PrivateMessageComponentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, autoHide = false, className = null, onItemClick = null, onMessageBack = null, ...rest} = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [messageObjs, setMessageObjs] = useState<any[]>([]);
  const [clear, setClear] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessageObjs, setLoadingMessageObjs] = useState<boolean>(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState<any>(id ?? null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);
  const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState<boolean>(false);
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [receiver, setReceiver] = useState(null);
  const [recipients, setRecipients] = useState<any>([]);
  const mobileSnippetsView = (layout === 'default' && !id) || (layout === 'mobile' && id);
  const mobileThreadView = (layout === 'mobile' && !id) || (layout === 'default' && id);
  const [newMessageThread, setNewMessageThread] = useState<boolean>(false);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const isNew = obj && obj === SCPrivateMessageStatusType.NEW;
  // REFS
  const refreshSubscription = useRef(null);
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const isNumber = typeof obj === 'number';
  console.log(openNewMessage);
  //  HANDLERS
  /**
   * Handles thread opening on click
   * @param item
   */
  const handleThreadOpening = (item) => {
    updateSnippetsParams(item.receiver.id, 'seen');
    onItemClick && onItemClick(item.receiver.id);
    setObj(item);
    setOpenNewMessage(false);
    isMobile && setLayout('mobile');
    id && setLayout('default');
  };
  /**
   * Handles thread closing after delete
   */
  const handleThreadClosing = () => {
    setObj(null);
    onItemClick && onItemClick(null);
  };
  /**
   * Handles new message opening on button action click
   */
  const handleOpenNewMessage = () => {
    setOpenNewMessage(!openNewMessage);
    setObj(SCPrivateMessageStatusType.NEW);
    onItemClick && onItemClick(SCPrivateMessageStatusType.NEW);
    isMobile && setLayout('mobile');
    id && setLayout('default');
  };
  /**
   * Handles delete message dialog opening
   * @param msg
   */
  const handleOpenDeleteMessageDialog = (msg) => {
    setOpenDeleteMessageDialog(true);
    setDeletingMsg(msg);
  };
  /**
   * Handles delete message dialog close
   */
  const handleCloseDeleteMessageDialog = () => {
    setOpenDeleteMessageDialog(false);
  };
  /**
   * Handles delete thread dialog opening
   */
  function handleOpenDeleteThreadDialog(threadObj) {
    setOpenDeleteThreadDialog(true);
    setDeletingThread(threadObj.id);
  }
  /**
   * Handles delete thread dialog close
   */
  const handleCloseDeleteThreadDialog = () => {
    setOpenDeleteThreadDialog(false);
  };
  /**
   * Handles
   */
  const handleMessageBack = () => {
    setLayout('default');
    id && setLayout('mobile');
    setOpenNewMessage(false);
    setObj(null);
    onMessageBack && onMessageBack();
  };
  /**
   * Handles snippets list update on message changes inside thread component
   * @param message
   */
  const handleSnippetsUpdate = (message: SCPrivateMessageThreadType) => {
    updateSnippetsList(message);
    if (openNewMessage) {
      setObj(message);
      setOpenNewMessage(false);
    }
  };

  /**
   * Handles autocomplete recipients selection
   * @param event
   * @param recipient
   */
  const handleRecipientSelect = (event, recipient) => {
    setRecipients(recipient);
  };
  /**
   * Memoized message recipients ids
   */
  const ids = useMemo(() => {
    if (recipients !== null && openNewMessage) {
      return recipients.map((u) => {
        return parseInt(u.id, 10);
      });
    }
    if (newMessageThread && !openNewMessage) {
      return recipients;
    }
  }, [recipients]);

  /**
   * Updates snippet headline and status or just snippet status
   * @param receiverId
   * @param status
   * @param headline
   */
  function updateSnippetsParams(receiverId: number, status: string, headline?: string) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.receiver.id === receiverId);
    if (index !== -1) {
      newSnippets[index].headline = headline ?? newSnippets[index].headline;
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  /**
   * Updates snippets list when a new message is sent or another one is deleted
   * @param message
   */
  function updateSnippetsList(message) {
    const newSnippets = [...snippets];
    const inList = newSnippets.some((o) => o.receiver.id === message.receiver.id);
    //if snippet is already present in the list, its headline gets updated
    if (inList) {
      const index = newSnippets.findIndex((s) => s.receiver.id === message.receiver.id);
      if (index !== -1) {
        newSnippets[index].headline = message.message;
        newSnippets[index].thread_status = message.thread_status;
        setSnippets(newSnippets);
      }
      //a new snippets gets added to the list
    } else {
      setSnippets((prev) => [...prev, message]);
    }
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
        deletingThread === obj?.id && handleThreadClosing();
        const _snippets = snippets.filter((s) => s.id !== deletingThread);
        setSnippets(_snippets);
        setClear(true);
      })
      .catch((error) => {
        setOpenDeleteThreadDialog(false);
        console.log(error);
      });
  }

  /**
   * Handles the deletion of a single message
   */
  function handleDeleteMessage() {
    PrivateMessageService.deleteAMessage(deletingMsg.id)
      .then(() => {
        const result = messageObjs.filter((m) => m.id !== deletingMsg.id);
        setMessageObjs(result);
        handleSnippetsUpdate(result.length >= 1 ? result.slice(-1)[0] : deletingMsg);
        handleCloseDeleteMessageDialog();
      })
      .catch((error) => {
        console.log(error);
        let _snackBar = enqueueSnackbar(<FormattedMessage id="ui.common.error" defaultMessage="ui.common.error" />, {
          variant: 'error',
          onClick: () => {
            closeSnackbar(_snackBar);
          }
        });
      });
  }
  /**
   * Handles message sending
   * @param message
   * @param file
   */
  function handleSend(message: string, file: SCPrivateMessageFileType) {
    console.log(openNewMessage, ids, 'send');
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      http
        .request({
          url: Endpoints.SendMessage.url(),
          method: Endpoints.SendMessage.method,
          data: {
            recipients: openNewMessage || isNew ? ids : [isNumber ? receiver.id : obj?.receiver?.id],
            message: message,
            file_uuid: file && !message ? file : null
          }
        })
        .then((res: any) => {
          setMessageObjs((prev) => [...prev, res.data]);
          handleSnippetsUpdate(res.data);
          if (openNewMessage || newMessageThread) {
            setNewMessageThread(false);
            setRecipients([]);
          }
        })
        .catch((error) => {
          console.log(error);
          let _snackBar = enqueueSnackbar(<FormattedMessage id="ui.common.error.messageError" defaultMessage="ui.common.error.messageError" />, {
            variant: 'error',
            onClick: () => {
              closeSnackbar(_snackBar);
            }
          });
        });
    }
  }

  /**
   * Fetches thread
   */
  function fetchThread() {
    const _userObjId = isNumber ? obj : obj?.receiver?.id !== authUserId ? obj?.receiver?.id : obj?.sender?.id;
    http
      .request({
        url: Endpoints.GetAThread.url(),
        method: Endpoints.GetAThread.method,
        params: {
          user: _userObjId
        }
      })
      .then((res: HttpResponse<any>) => {
        const data = res.data;
        setMessageObjs(data.results);
        if (data.results.length) {
          if (data.results[0].receiver.id !== authUserId) {
            setReceiver(data.results[0].receiver);
          } else {
            setReceiver(data.results[0].sender);
          }
          setNewMessageThread(false);
        } else {
          setNewMessageThread(true);
          setRecipients(_userObjId);
        }
        setLoadingMessageObjs(false);
      })
      .catch((error) => {
        setLoadingMessageObjs(false);
        console.log(error);
        Logger.error(SCOPE_SC_UI, {error});
      });
  }
  /**
   * Memoized fetchSnippets
   */
  const fetchSnippets = useMemo(
    () => () => {
      return PrivateMessageService.getAllSnippets()
        .then((data: any) => {
          setSnippets(data.results);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          Logger.error(SCOPE_SC_UI, {error});
        });
    },
    []
  );

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    authUserId && fetchSnippets();
  }, [authUserId]);

  /**
   * On mount, if obj, fetches thread
   */
  useEffect(() => {
    obj && fetchThread();
  }, [obj, authUserId]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    updateSnippetsParams(res.notification_obj.message.sender.id, res.notification_obj.snippet.thread_status, res.notification_obj.snippet.headline);
    const newMessages = [...messageObjs];
    const index = newMessages.findIndex((m) => m.sender.id === res.notification_obj.message.sender.id);
    if (index !== -1) {
      setMessageObjs((prev) => [...prev, res.notification_obj.message]);
    }
  };

  /**
   * When a ws notification arrives, updates thread and snippets data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, [snippets, messageObjs]);
  /**
   * Renders snippets section
   */
  function renderSnippets() {
    return (
      <Grid item xs={12} md={5} className={classes.snippetsBox}>
        <PrivateMessageSnippets
          snippets={snippets}
          loading={loading}
          snippetActions={{
            onSnippetClick: handleThreadOpening,
            onNewMessageClick: handleOpenNewMessage,
            onMenuItemClick: handleOpenDeleteThreadDialog
          }}
          userObj={obj ?? null}
          clearSearch={clear}
        />
        {openDeleteThreadDialog && (
          <ConfirmDialog
            open={openDeleteThreadDialog}
            title={
              <FormattedMessage
                id="ui.privateMessage.component.delete.thread.dialog.msg"
                defaultMessage="ui.privateMessage.component.delete.thread.dialog.msg"
              />
            }
            btnConfirm={
              <FormattedMessage
                id="ui.privateMessage.component.delete.thread.dialog.confirm"
                defaultMessage="ui.privateMessage.component.delete.thread.dialog.confirm"
              />
            }
            onConfirm={handleDeleteThread}
            onClose={handleCloseDeleteThreadDialog}
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
          receiver={receiver}
          recipients={recipients}
          userObj={obj ?? null}
          loadingMessageObjs={loadingMessageObjs}
          messages={messageObjs}
          newMessageThread={newMessageThread}
          threadCallbacks={{
            onMessageBack: handleMessageBack,
            onMessageDelete: handleOpenDeleteMessageDialog,
            onRecipientSelect: handleRecipientSelect,
            onMessageSend: handleSend
          }}
        />
        {openDeleteMessageDialog && (
          <ConfirmDialog
            open={openDeleteMessageDialog}
            title={
              <FormattedMessage
                id="ui.privateMessage.component.delete.message.dialog.msg"
                defaultMessage="ui.privateMessage.component.delete.message.dialog.msg"
              />
            }
            btnConfirm={
              <FormattedMessage
                id="ui.privateMessage.component.delete.message.dialog.confirm"
                defaultMessage="ui.privateMessage.component.delete.message.dialog.confirm"
              />
            }
            onConfirm={handleDeleteMessage}
            onClose={handleCloseDeleteMessageDialog}
          />
        )}
      </Grid>
    );
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!authUserId) {
    return <HiddenPlaceholder />;
  }
  if (!autoHide) {
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
  return <HiddenPlaceholder />;
}
