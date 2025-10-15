import React from 'react';
import {Slide, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCPaymentProductsDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

const Transition = React.forwardRef(function Transition(props: TransitionProps & {children: React.ReactElement}, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoTransition = React.forwardRef(function NoTransition(props: {children: React.ReactElement}) {
  return <React.Fragment> {props.children} </React.Fragment>;
});

export interface PaymentDetailDialogProps extends BaseDialogProps {
  className?: string;
  disableInitialTransition?: boolean;
}

export default function PaymentDetailDialog(inProps: PaymentDetailDialogProps) {
  // PROPS
  const props: PaymentDetailDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, disableInitialTransition = false, ...rest} = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root
      maxWidth="sm"
      fullWidth
      title={<FormattedMessage id="ui.paymentDetailDialog.title" defaultMessage="ui.paymentDetailDialog.title" />}
      scroll="paper"
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      slots={{
        transition: Transition
      }}
      {...rest}>
      <FormattedMessage id="ui.paymentDetailDialog.content" defaultMessage="ui.paymentDetailDialog.content" />
    </Root>
  );
}
