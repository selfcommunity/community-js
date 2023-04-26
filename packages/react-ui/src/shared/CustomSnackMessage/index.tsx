import React, {forwardRef, useCallback} from 'react';
import {useSnackbar, SnackbarContent} from 'notistack';
import {styled} from '@mui/material/styles';
import {CardContent, IconButton} from '@mui/material';
import Icon from '@mui/material/Icon';
import Widget from '../../components/Widget';

const PREFIX = 'SCCustomSnackMessage';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  content: `${PREFIX}-content`,
  close: `${PREFIX}-close`
};

const Root = styled(SnackbarContent, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
      <Widget className={classes.card}>
        <CardContent className={classes.content}>
          <IconButton className={classes.close} onClick={handleDismiss}>
            <Icon>close</Icon>
          </IconButton>
          {props.message}
        </CardContent>
      </Widget>
    </Root>
  );
});

export default CustomSnackMessage;
