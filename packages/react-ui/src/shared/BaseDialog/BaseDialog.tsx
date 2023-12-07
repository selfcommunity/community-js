import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, {DialogContentProps} from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import classNames from 'classnames';
import {useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import MuiDialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCBaseDialog';

const classes = {
  root: `${PREFIX}-root`,
  titleRoot: `${PREFIX}-title-root`
};

const DialogTitleRoot = styled(MuiDialogTitle, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.titleRoot
})(({theme}) => ({}));

const DialogTitle = ({children = null, onClose = null}): JSX.Element => {
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});

  return (
    <DialogTitleRoot className={classes.titleRoot}>
      <span>{children}</span>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <Icon>{isMobile ? 'arrow_back' : 'close'}</Icon>
        </IconButton>
      ) : null}
    </DialogTitleRoot>
  );
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
  // OPTIONS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});
  const fullScreen = isMobile;

  // PROPS
  const {
    className = '',
    title = '',
    subtitle = null,
    DialogContentProps = {dividers: !isMobile},
    open = false,
    onClose = null,
    actions = null,
    children,
    maxWidth = 'sm',
    scroll = 'body',
    ...rest
  } = props;

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
      maxWidth={maxWidth}
      scroll={scroll}
      {...rest}>
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      {subtitle && subtitle}
      <DialogContent {...DialogContentProps}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Root>
  );
}
