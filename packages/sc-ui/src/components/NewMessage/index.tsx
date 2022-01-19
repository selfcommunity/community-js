import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import PrivateMessageCard from './NewMessageCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const PREFIX = 'SCPrivateMessage';

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  padding: 16,
  '& .MuiSvgIcon-root': {
    marginRight: '5px'
  }
}));

export interface NewMessageProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NewMessage(props: NewMessageProps): JSX.Element {
  // PROPS
  const {autoHide, className, ...rest} = props;

  // STATE
  const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);

  // HANDLERS
  const handleClose = () => {
    setOpenNewMessage(false);
  };

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <React.Fragment>
        <Root className={className} {...rest} onClick={() => setOpenNewMessage(!openNewMessage)}>
          <AddCircleOutlineIcon />
          <FormattedMessage id="ui.NewMessage.new" defaultMessage="ui.NewMessage.new" />
        </Root>
        {openNewMessage && <PrivateMessageCard open={openNewMessage} onClose={handleClose} />}
      </React.Fragment>
    );
  }
  return null;
}
