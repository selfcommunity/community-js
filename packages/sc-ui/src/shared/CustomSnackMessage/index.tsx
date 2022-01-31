import React, {forwardRef, useCallback} from 'react';
import {useSnackbar, SnackbarContent} from 'notistack';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  [theme.breakpoints.up('sm')]: {
    minWidth: '344px !important'
  },
  [`& .${classes.card}`]: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: '16px'
  },
  [`& .${classes.closeAction}`]: {
    position: 'absolute',
    right: 0,
    top: 0
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
      <Card className={classes.card} elevation={1}>
        <IconButton className={classes.closeAction} onClick={handleDismiss}>
          <CloseIcon />
        </IconButton>
        {props.message}
      </Card>
    </Root>
  );
});

export default CustomSnackMessage;
