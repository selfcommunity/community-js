import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, Typography, Button, Box, Card} from '@mui/material';
import Snippets from '../Snippets';
import Thread from '../Thread';
import {FormattedMessage} from 'react-intl';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {SCUserContext, SCUserContextType} from '@selfcommunity/core';
import classNames from 'classnames';

const PREFIX = 'SCPrivateMessages';

const classes = {
  root: `${PREFIX}-root`,
  newMessage: `${PREFIX}-newMessage`,
  selected: `${PREFIX}-selected`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  [`& .${classes.newMessage}`]: {
    width: '100%',
    justifyContent: 'flex-start',
    '& .MuiSvgIcon-root': {
      marginRight: '5px'
    }
  },
  [`& .${classes.selected}`]: {
    background: '#9dd4af',
    justifyContent: 'flex-start',
    width: '100%',
    '& .MuiSvgIcon-root': {
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
 > API documentation for the Community-UI Private Messages component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessages} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCPrivateMessages` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessages-root|Styles applied to the root element.|
 |newMessage|.SCPrivateMessages-newMessage|Styles applied to the new message element.|
 |selected|.SCPrivateMessages-selected|Styles applied to the selected element.|


 * @param props
 */
export default function PrivateMessages(props: PrivateMessagesProps): JSX.Element {
  //PROPS
  const {autoHide = false, className = null, ...rest} = props;

  // STATE
  const [obj, setObj] = useState(null);
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);

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

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        <div>
          <Button className={openNewMessage ? classes.selected : classes.newMessage} onClick={handleOpenNewMessage}>
            <AddCircleOutlineIcon />
            <FormattedMessage id="ui.NewMessage.new" defaultMessage="ui.NewMessage.new" />
          </Button>
          <Snippets onSnippetClick={handleThreadOpening} threadId={obj ? obj.id : null} />
        </div>
        <div style={{overflow: 'auto', maxHeight: '500px'}}>
          <Thread id={obj ? obj.id : null} receiverId={obj ? obj.receiver.id : null} openNewMessage={openNewMessage} />
        </div>
      </Root>
    );
  }
  return null;
}
