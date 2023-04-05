import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, {DialogContentProps} from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import Title from './title';
import classNames from 'classnames';
import {useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCBaseDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
   * Dialog subtitle
   * @default ''
   */
  subtitle?: any;
  /**
   * Dialog content props
   * @default {dividers: !isMobile}
   */
  DialogContentProps?: DialogContentProps;
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
   * Actions for the dialog
   */
  actions?: ReactNode;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function BaseDialog(props: BaseDialogProps) {
  // PROPS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    className = '',
    title = '',
    subtitle = null,
    DialogContentProps = {dividers: !isMobile},
    open = false,
    onClose = null,
    actions = null,
    children,
    ...rest
  } = props;

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
      {subtitle && subtitle}
      <DialogContent {...DialogContentProps}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Root>
  );
}
