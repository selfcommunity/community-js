import React, {forwardRef, useCallback} from 'react';
import {useSnackbar, SnackbarContent} from 'notistack';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {IconButton} from '@mui/material';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCCustomSnackMessage';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  closeAction: `${PREFIX}-close-action`
};

const Root = styled(SnackbarContent, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  border: '0 none',
  borderRadius: '15px',
  boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('sm')]: {
    minWidth: '344px !important'
  },
  [`& .${classes.card}`]: {
    backgroundColor: '#fff',
    width: '100%',
    padding: theme.spacing(),
    borderRadius: 30
  },
  [`& .${classes.closeAction}`]: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.text.primary
  }
}));

/**
 * Custom Snackbar for notistack messages
 * Use this component:
 *  - pass this component as property 'content' in the 'options' of enqueueSnackbar
 *
 * This component add a CloseIcon button on the top-right corner
 * and attach a close handler that close the snackMessage identified as props.id
 */
const CustomSnackMessage = forwardRef<HTMLDivElement, {id: string | number; message: string | React.ReactNode}>((props, ref) => {
  const {closeSnackbar} = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(props.id);
  }, [props.id, closeSnackbar]);

  return (
    <Root ref={ref} className={classes.root} key={props.id}>
      <Card className={classes.card} elevation={0}>
        <IconButton className={classes.closeAction} onClick={handleDismiss}>
          <Icon>close</Icon>
        </IconButton>
        {props.message}
      </Card>
    </Root>
  );
});

export default CustomSnackMessage;
