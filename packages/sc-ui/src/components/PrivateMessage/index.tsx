import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Box, IconButton, Tooltip} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {FormattedMessage} from 'react-intl';
import PrivateMessageCard from './PrivateMessageCard';

const PREFIX = 'SCPrivateMessage';

const classes = {
  buttonBox: `${PREFIX}-button-box`,
  icon: `${PREFIX}-icon`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  padding: 16,
  [`& .${classes.buttonBox}`]: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'flex-end'
  },
  [`& .${classes.icon}`]: {
    backgroundColor: theme.palette.grey['A200'],
    border: 'solid'
  }
}));

export default function PrivateMessage({className = '', autoHide = null, ...props}: {className?: string; autoHide?: boolean}): JSX.Element {
  const [openMessageCard, setOpenMessageCard] = useState<boolean>(false);
  const handleClose = () => {
    setOpenMessageCard(false);
  };

  const c = (
    <React.Fragment>
      <Box className={classes.buttonBox}>
        <Tooltip title={<FormattedMessage defaultMessage="ui.PrivateMessage.new" id="ui.PrivateMessage.new" />}>
          <IconButton className={classes.icon} onClick={() => setOpenMessageCard(!openMessageCard)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {openMessageCard && <PrivateMessageCard open={openMessageCard} onClose={handleClose} />}
    </React.Fragment>
  );

  if (!autoHide) {
    return (
      <Root className={className} {...props}>
        <CardContent>{c}</CardContent>
      </Root>
    );
  }
  return null;
}
