import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Snippets from '../Snippets';
import Thread from '../Thread';
import {Box} from '@mui/material';

const PREFIX = 'SCPrivateMessage';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row'
}));

export interface PrivateMessageProps {
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

export default function PrivateMessage(props: PrivateMessageProps): JSX.Element {
  // PROPS
  const {autoHide, className, ...rest} = props;

  // STATE
  // const [openNewMessage, setOpenNewMessage] = useState<boolean>(false);

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <React.Fragment>
        <Root className={className} {...rest}>
          <Snippets />
          <Thread />
        </Root>
      </React.Fragment>
    );
  }
  return null;
}
