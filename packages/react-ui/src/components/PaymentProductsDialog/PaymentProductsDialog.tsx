import React from 'react';
import {Slide} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import PaymentProducts from '../PaymentProducts';
import {PaymentProductsProps} from '../PaymentProducts';
import {FormattedMessage} from 'react-intl';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';

const PREFIX = 'SCPaymentProductsDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

const Transition = React.forwardRef(function Transition(props: TransitionProps & {children: React.ReactElement}, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoTransition = React.forwardRef(function NoTransition(props: {children: React.ReactElement}, ref) {
  return <React.Fragment> {props.children} </React.Fragment>;
});

export interface PaymentProductDialogProps extends BaseDialogProps {
  className?: string;
  PaymentProductsComponentProps: PaymentProductsProps;
  disableInitialTransition?: boolean;
}

export default function PaymentProductsDialog(inProps: PaymentProductDialogProps) {
  // PROPS
  const props: PaymentProductDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, PaymentProductsComponentProps, disableInitialTransition = false, ...rest} = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root
      maxWidth={'sm'}
      fullWidth
      title={<FormattedMessage id="ui.paymentProductsDialog.title" defaultMessage="ui.paymentProductsDialog.title" />}
      scroll={'paper'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <PaymentProducts {...PaymentProductsComponentProps} />
    </Root>
  );
}
