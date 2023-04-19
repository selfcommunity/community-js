import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useTheme, useMediaQuery} from '@mui/material';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCPrivateMessageStatusType} from '@selfcommunity/types';
import PrivateMessageThread from '../PrivateMessageThread';
import PrivateMessageSnippets from '../PrivateMessageSnippets';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCPrivateMessageComponent';

const classes = {
  root: `${PREFIX}-root`,
  snippetsBox: `${PREFIX}-snippets-box`,
  threadBox: `${PREFIX}-thread-box`,
  hide: `${PREFIX}-hide`
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
   * Handler on thread back
   * @default null
   */
  onThreadBack?: () => void;
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
 |hide|.SCPrivateMessageComponent-hide|Styles applied to the snippetBox or threadBox grid item element on mobile view.|

 * @param inProps
 */
export default function PrivateMessageComponent(inProps: PrivateMessageComponentProps): JSX.Element {
  //PROPS
  const props: PrivateMessageComponentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, autoHide = false, className = null, onItemClick = null, onThreadBack = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  // STATE
  const theme = useTheme<SCThemeType>();
  const [clear, setClear] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [layout, setLayout] = useState('default');
  const [obj, setObj] = useState<any>(id ?? null);
  const isNew = obj && obj === SCPrivateMessageStatusType.NEW;
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(isNew ?? false);
  const mobileSnippetsView = (layout === 'default' && !id) || (layout === 'mobile' && id);
  const mobileThreadView = (layout === 'mobile' && !id) || (layout === 'default' && id);
  const messageReceiver = (item, loggedUserId) => {
    if (typeof item === 'number') {
      return item;
    }
    return item?.receiver?.id !== loggedUserId ? item?.receiver?.id : item?.sender?.id;
  };

  //  HANDLERS
  /**
   * Handles thread opening on click
   * @param item
   */
  const handleThreadOpening = (item) => {
    onItemClick && onItemClick(messageReceiver(item, authUserId));
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
    onThreadBack && onThreadBack();
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
  const handleOnNewMessageSent = (msg, single) => {
    if (openNewMessage) {
      onItemClick && onItemClick(single ? messageReceiver(msg, authUserId) : '');
      setObj(single ? msg : null);
      setOpenNewMessage(false);
    }
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
          userObj={obj}
          clearSearch={clear}
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
          userObj={obj}
          openNewMessage={openNewMessage}
          onNewMessageClose={handleMessageBack}
          onNewMessageSent={handleOnNewMessageSent}
        />
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
        {renderSnippets()}
        {renderThread()}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
