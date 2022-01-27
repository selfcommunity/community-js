import React, {forwardRef, useCallback} from 'react';
import {useSnackbar, SnackbarContent} from 'notistack';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';

const PREFIX = 'SCUserToastNotification';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  actionRoot: `${PREFIX}-actionRoot`,
  typography: `${PREFIX}-typography`,
  icons: `${PREFIX}-icons`,
  button: `${PREFIX}-button`
};

const Root = styled(SnackbarContent, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: '344px !important'
  },
  [`& .${classes.card}`]: {
    backgroundColor: '#f0f0f0',
    width: '100%'
  },
  [`& .${classes.actionRoot}`]: {
    padding: '8px 8px 8px 16px',
    justifyContent: 'space-between'
  },
  [`& .${classes.typography}`]: {
    fontWeight: 'bold'
  },
  [`& .${classes.icons}`]: {
    marginLeft: 'auto'
  },
  [`& .${classes.button}`]: {
    padding: 0,
    textTransform: 'none'
  }
}));

const SnackMessage = forwardRef<HTMLDivElement, {id: string | number; message: string | React.ReactNode}>((props, ref) => {
  const {closeSnackbar} = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(props.id);
  }, [props.id, closeSnackbar]);

  return (
    <Root ref={ref}>
      <Card classes={{root: classes.card}}>
        <CardContent>{props.message}</CardContent>
      </Card>
    </Root>
  );
});

export default SnackMessage;
