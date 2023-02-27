import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useTheme, useMediaQuery} from '@mui/material';
import {ConfirmDialog, PrivateMessageSnippets} from '@selfcommunity/react-ui';
import {PrivateMessageThread} from '@selfcommunity/react-ui';
import {FormattedMessage} from 'react-intl';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Endpoints, http, HttpResponse, PrivateMessageService} from '@selfcommunity/api-services';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PubSub from 'pubsub-js';

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
  const [snippets, setSnippets] = useState<any[]>([]);
  const [clear, setClear] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState<any>(id ?? null);
  const [deletingThread, setDeletingThread] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);
  const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState<boolean>(false);
  const mobileSnippetsView = (layout === 'default' && !id) || (layout === 'mobile' && id);
  const mobileThreadView = (layout === 'mobile' && !id) || (layout === 'default' && id);
  // REFS
  const refreshSubscription = useRef(null);
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  //  HANDLERS
  const handleThreadOpening = (i) => {
    updateSnippetsParams(i.id, 'seen');
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
    updateSnippetsList(message);
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
   * Updates snippet headline and status or just snippet status
   * @param id
   * @param status
   * @param headline
   */
  function updateSnippetsParams(id: number, status: string, headline?: string) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === id);
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
    if (inList) {
      const index = newSnippets.findIndex((s) => s.receiver.id === message.receiver.id);
      if (index !== -1) {
        newSnippets[index].headline = message.message;
        setSnippets(newSnippets);
      }
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
        deletingThread === obj?.id && setObj(null);
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
   * Memoized fetchSnippets
   */
  const fetchSnippets = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetSnippets.url(),
          method: Endpoints.GetSnippets.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets()
      .then((data: any) => {
        setSnippets(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authUserId]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    updateSnippetsParams(res.thread_id, res.notification_obj.snippet.thread_status, res.notification_obj.snippet.headline);
  };

  /**
   * When a ws notification arrives, updates data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, [snippets]);
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
            onMenuItemClick: handleThreadToDelete
          }}
          threadObj={obj ?? null}
          clearSearch={clear}
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
