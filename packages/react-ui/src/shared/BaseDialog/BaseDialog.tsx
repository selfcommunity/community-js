import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {FormattedMessage} from 'react-intl';
import useMediaQuery from '@mui/material/useMediaQuery';
import Title from './title';
import classNames from 'classnames';

const PREFIX = 'SCBaseDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  [theme.breakpoints.only('xs')]: {
    '& .MuiDialogContent-root': {
      padding: 0
    }
  },
  minWidth: 500
}));

export interface BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Dialog title
   * @default ''
   */
  title?: any;
  /**
   * Handles dialog opening
   * @default false
   */
  open?: boolean;
  /**
   * Handles dialog closing
   * @default null
   */
  onClose?: () => any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function BaseDialog(props: BaseDialogProps) {
  // PROPS
  const {className, title = '', open = false, onClose = null, ...rest} = props;
  const {children} = rest;

  // OPTIONS
  const fullScreen = useMediaQuery((theme) => theme['breakpoints'].down('sm'), {noSsr: typeof window !== 'undefined'});

  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(classes.root, className)}
      fullScreen={fullScreen}
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth={rest.maxWidth ? rest.maxWidth : 'sm'}
      scroll="body">
      <Title onClose={onClose}>{title}</Title>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus variant={'outlined'}>
          <FormattedMessage id="ui.baseDialog.button.close" defaultMessage="ui.baseDialog.button.close" />
        </Button>
      </DialogActions>
    </Root>
  );
}
