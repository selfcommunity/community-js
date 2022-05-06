import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Box} from '@mui/material';
import {Snippets} from '@selfcommunity/react-ui';
import {Thread} from '@selfcommunity/react-ui';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCPrivateMessagesTemplate';

const classes = {
  root: `${PREFIX}-root`,
  snippetsBox: `${PREFIX}-snippets-box`,
  threadBox: `${PREFIX}-thread-box`,
  newMessage: `${PREFIX}-new-message`,
  selected: `${PREFIX}-selected`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  height: '100%',
  display: 'flex',
  flexFlow: 'row',
  [`& .${classes.snippetsBox}`]: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  [`& .${classes.threadBox}`]: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
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
 > API documentation for the Community-UI Private Messages template. Learn about the available props and the CSS API.

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
 |newMessage|.SCPrivateMessagesTemplate-new-message|Styles applied to the new message element.|
 |selected|.SCPrivateMessagesTemplate-selected|Styles applied to the selected element.|
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
  const {autoHide = false, className = null, ...rest} = props;

  // STATE
  const [obj, setObj] = useState(null);
  const [data, setData] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //  HANDLERS
  const handleThreadOpening = (i) => {
    setObj(i);
    setOpenNewMessage(false);
  };

  const handleOpenNewMessage = () => {
    setOpenNewMessage(!openNewMessage);
    setObj(null);
  };

  const handleSnippetsUpdate = (data) => {
    setData(data.message);
  };

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        <Box className={classes.snippetsBox}>
          <Button className={openNewMessage ? classes.selected : classes.newMessage} onClick={handleOpenNewMessage}>
            <Icon>add_circle_outline</Icon>
            <FormattedMessage id="templates.privateMessages.button.new" defaultMessage="templates.privateMessages.button.new" />
          </Button>
          <Snippets onSnippetClick={handleThreadOpening} threadId={obj ? obj.id : null} getSnippetHeadline={data} shouldUpdate={shouldUpdate} />
        </Box>
        <Box className={classes.threadBox}>
          <Thread
            id={obj ? obj.id : null}
            receiverId={obj && !openNewMessage ? obj.receiver.id : null}
            openNewMessage={openNewMessage}
            onNewMessageSent={openNewMessage ? setObj : null}
            onMessageSent={handleSnippetsUpdate}
            shouldUpdate={setShouldUpdate}
          />
        </Box>
      </Root>
    );
  }
  return null;
}
