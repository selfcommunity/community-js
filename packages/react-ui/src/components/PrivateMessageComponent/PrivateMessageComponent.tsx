import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useTheme, useMediaQuery} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCThemeType, SCUserContext, SCUserContextType, UserUtils} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Endpoints, http, HttpResponse, PrivateMessageService} from '@selfcommunity/api-services';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageFileType, SCPrivateMessageStatusType} from '@selfcommunity/types';
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
   * Handler on thread delete
   * @default null
   */
  onThreadDelete?: () => void;
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
  const {id = null, autoHide = false, className = null, onItemClick = null, onThreadDelete = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

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
  const isNew = obj && obj === SCPrivateMessageStatusType.NEW;
  const [deletingThread, setDeletingThread] = useState(null);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(isNew ?? false);
  const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState<boolean>(false);
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [receiver, setReceiver] = useState(null);
  const [recipients, setRecipients] = useState<any>([]);
  const mobileSnippetsView = (layout === 'default' && !id) || (layout === 'mobile' && id);
  const mobileThreadView = (layout === 'mobile' && !id) || (layout === 'default' && id);
  const [singleMessageThread, setSingleMessageThread] = useState<boolean>(false);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const isNumber = typeof obj === 'number';
  const messageReceiver = (item, loggedUserId) => {
    return item?.receiver?.id !== loggedUserId ? item?.receiver?.id : item?.sender?.id;
  };
  // REFS
  const refreshSubscription = useRef(null);

  //  HANDLERS
  /**
   * Handles thread opening on click
   * @param item
   */
  const handleThreadOpening = (item) => {
    updateSnippetsParams(item.id, 'seen');
    onItemClick && onItemClick(messageReceiver(item, authUserId));
    // onItemClick && onItemClick(item.receiver.id !== authUserId ? item.receiver.id : item.sender.id);
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
    onThreadDelete && onThreadDelete();
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
    //setDeletingThread(threadObj.thread_id ?? threadObj.id);
    setDeletingThread(messageReceiver(threadObj, authUserId));
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
    onThreadDelete && onThreadDelete();
  };
  /**
   * Handles snippets list update on message changes inside thread component
   * @param message
   */
  const handleSnippetsUpdate = (message: any) => {
    // const _receiver = authUserId !== message[0].receiver.id ? message[0].receiver.id : message[0].sender.id;
    updateSnippetsList(message);
    if (openNewMessage) {
      onItemClick && onItemClick(messageReceiver(message[0], authUserId));
      setObj(message[0]);
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
    return [recipients];
  }, [recipients]);

  /**
   * Updates snippet headline and status or just snippet status
   * @param threadId
   * @param status
   * @param headline
   */
  function updateSnippetsParams(threadId: number, status: string, headline?: string) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === threadId);
    if (index !== -1) {
      newSnippets[index].headline = headline ?? newSnippets[index].headline;
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  /**
   * Updates snippets list when a new message(or more) are sent or another one is deleted
   * @param message, it can be a single object or an array of objects
   */
  function updateSnippetsList(message: any) {
    const newSnippets = [...snippets];
    message.map((m) => {
      const idx = newSnippets.findIndex((s) =>
        Object.prototype.hasOwnProperty.call(s, 'thread_id') ? s.thread_id === m.thread_id : s.id === m.thread_id
      );
      if (idx !== -1) {
        newSnippets[idx].headline = m.message;
        newSnippets[idx].thread_status = m.status;
      } else {
        setSnippets((prev) => [...prev, m]);
      }
    });
  }

  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    // const _threadId = obj?.thread_id ?? obj?.id;
    PrivateMessageService.deleteAThread({user: deletingThread})
      .then(() => {
        if (layout === 'mobile') {
          setLayout('default');
        }
        id && setLayout('mobile');
        setOpenDeleteThreadDialog(false);
        deletingThread === messageReceiver(obj, authUserId) && handleThreadClosing();
        //deletingThread === _threadId && handleThreadClosing();
        // const _snippets = snippets.filter((s) =>
        //   Object.prototype.hasOwnProperty.call(s, 'thread_id') ? s.thread_id !== deletingThread : s.id !== deletingThread
        // );
        const _snippets = snippets.filter((s) => messageReceiver(s, authUserId) !== deletingThread);
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
        handleSnippetsUpdate(result.length >= 1 ? result.slice(-1) : deletingMsg);
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
    //const _receiver = authUserId !== obj?.receiver?.id ? obj?.receiver?.id : obj?.sender?.id;
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
            recipients: openNewMessage || isNew || singleMessageThread ? ids : [isNumber && obj ? obj : messageReceiver(obj, authUserId)],
            message: message,
            file_uuid: file && !message ? file : null
          }
        })
        .then((res: any) => {
          const single = res.data.length <= 1;
          single && setMessageObjs((prev) => [...prev, res.data[0]]);
          handleSnippetsUpdate(res.data);
          if (openNewMessage || singleMessageThread) {
            setSingleMessageThread(false);
            setOpenNewMessage(false);
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
    //const _userObjId = isNumber ? obj : obj?.receiver?.id !== authUserId ? obj?.receiver?.id : obj?.sender?.id;
    const _userObjId = isNumber ? obj : messageReceiver(obj, authUserId);
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
          setSingleMessageThread(false);
        } else {
          setSingleMessageThread(true);
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
    updateSnippetsParams(res.thread_id, res.notification_obj.snippet.thread_status, res.notification_obj.snippet.headline);
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
          userObj={obj}
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
          userObj={obj}
          loadingMessageObjs={loadingMessageObjs}
          messages={messageObjs}
          singleMessageThread={singleMessageThread}
          threadCallbacks={{
            onThreadDelete: handleMessageBack,
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
