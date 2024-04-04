import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useMediaQuery, useTheme} from '@mui/material';
import {SCPreferencesContextType, SCThemeType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCFeatureName, SCPrivateMessageStatusType, SCPrivateMessageType} from '@selfcommunity/types';
import PrivateMessageThread from '../PrivateMessageThread';
import PrivateMessageSnippets from '../PrivateMessageSnippets';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  snippetsBox: `${PREFIX}-snippets-box`,
  threadBox: `${PREFIX}-thread-box`,
  hide: `${PREFIX}-hide`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
   * Handler on single message open
   * @default null
   */
  onSingleMessageOpen?: (id) => void;
  /**
   * Handler on thread back
   * @default null
   */
  onThreadBack?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 *
 * > API documentation for the Community-JS Private Messages component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the private messages section.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/PrivateMessages)

 #### Import

 ```jsx
 import {PrivateMessageComponent} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageComponent` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageComponent-root|Styles applied to the root element.|
 |snippetsBox|.SCPrivateMessageComponent-snippets-box|Styles applied to the snippets box element.|
 |threadBox|.SCPrivateMessageComponent-thread-box|Styles applied to the thread box element.|
 |hide|.SCPrivateMessageComponent-hide|Styles applied to the snippetBox or threadBox grid item element on mobile view.|

 * @param inProps
 */
export default function PrivateMessageComponent(inProps: PrivateMessageComponentProps): JSX.Element {
  //PROPS
  const props: PrivateMessageComponentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, onItemClick = null, onThreadBack = null, onSingleMessageOpen = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // STATE
  const theme = useTheme<SCThemeType>();
  const [clear, setClear] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState<any>(id ?? null);
  const [type, setType] = useState<SCPrivateMessageType | null>(null);
  const isNew = obj && obj === SCPrivateMessageStatusType.NEW;
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(isNew ?? false);
  const mobileSnippetsView = (layout === 'default' && !obj) || (layout === 'mobile' && !obj);
  const mobileThreadView = (layout === 'default' && obj) || (layout === 'mobile' && obj);

  const messageReceiver = (item, loggedUserId) => {
    if (typeof item === 'number') {
      return item;
    }
    return item?.receiver?.id !== loggedUserId ? item?.receiver?.id : item?.sender?.id;
  };

  // MEMO
  const privateMessagingEnabled = useMemo(() => scPreferences.features.includes(SCFeatureName.PRIVATE_MESSAGING), [scPreferences.features]);
  const authUserId = useMemo(() => (scUserContext.user ? scUserContext.user.id : null), [scUserContext.user]);

  useEffect(() => {
    setObj(id ?? null);
  }, [id]);

  //  HANDLERS
  /**
   * Handles thread opening on click
   * @param item
   * @param type
   */
  const handleThreadOpening = (item, type) => {
    onItemClick && onItemClick(item.group ? item.group.id : messageReceiver(item, authUserId));
    setType(type);
    setObj(item.group ? item : messageReceiver(item, authUserId));
    setOpenNewMessage(false);
  };

  /**
   * Handles thread closing after delete
   */
  const handleThreadClosing = () => {
    setObj(null);
    onThreadBack && onThreadBack();
  };
  /**
   * Handles new message opening on button action click
   */
  const handleOpenNewMessage = () => {
    setOpenNewMessage(!openNewMessage);
    setObj(SCPrivateMessageStatusType.NEW);
    onItemClick && onItemClick(SCPrivateMessageStatusType.NEW);
  };

  /**
   * Handles new messages open from user profile page or notifications section
   */
  const handleSingleMessage = (open: boolean) => {
    open && onSingleMessageOpen(SCPrivateMessageStatusType.NEW);
  };

  /**
   * Handles Layout update when new message section gets closed
   */
  const handleMessageBack = () => {
    setLayout('default');
    id && setLayout('mobile');
    setOpenNewMessage(false);
    setObj(null);
    onThreadBack && onThreadBack();
  };
  /**
   * Handles state update when a new message is sent
   */
  const handleOnNewMessageSent = (msg, isOne) => {
    onItemClick && onItemClick(isOne ? messageReceiver(msg, authUserId) : '');
    setObj(isOne ? messageReceiver(msg, authUserId) : null);
    setOpenNewMessage(false);
  };

  /**
   * Handles thread deletion
   */
  function handleDeleteThread(deletingThread) {
    deletingThread === messageReceiver(obj, authUserId) && handleThreadClosing();
    setClear(true);
  }

  /**
   * Renders snippets section
   */
  function renderSnippets() {
    return (
      <Grid item xs={12} md={5} className={classNames(classes.snippetsBox, {[classes.hide]: isMobile && mobileThreadView})}>
        <PrivateMessageSnippets
          snippetActions={{
            onSnippetClick: handleThreadOpening,
            onNewMessageClick: handleOpenNewMessage,
            onDeleteConfirm: handleDeleteThread
          }}
          threadObj={obj}
          clearSearch={clear}
          elevation={0}
        />
      </Grid>
    );
  }
  /**
   * Renders thread section
   */
  function renderThread() {
    return (
      <Grid item xs={12} md={7} className={classNames(classes.threadBox, {[classes.hide]: isMobile && mobileSnippetsView})}>
        <PrivateMessageThread
          threadObj={obj}
          type={type}
          openNewMessage={openNewMessage}
          onNewMessageClose={handleMessageBack}
          onNewMessageSent={handleOnNewMessageSent}
          onSingleMessageOpen={handleSingleMessage}
          elevation={0}
        />
      </Grid>
    );
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!authUserId || !privateMessagingEnabled) {
    return null;
  }
  return (
    <Root container {...rest} className={classNames(classes.root, className)}>
      {renderSnippets()}
      {renderThread()}
    </Root>
  );
}
