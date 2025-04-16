import React from 'react';
import {Slide} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PaywallsProps} from '../Paywalls/Paywalls';
import Paywalls from '../Paywalls';

const PREFIX = 'SCPaywallsDialog';

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

export interface PaywallsDialogProps extends BaseDialogProps {
  className?: string;
  PaywallsComponentProps: PaywallsProps;
  disableInitialTransition?: boolean;
}

export default function PaywallsDialog(inProps: PaywallsDialogProps) {
  // PROPS
  const props: PaywallsDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, PaywallsComponentProps, disableInitialTransition = false, ...rest} = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root
      maxWidth={'sm'}
      fullWidth
      title={
        (PaywallsComponentProps && PaywallsComponentProps.prefetchedPaymentContentStatus?.payment_order) ||
        (PaywallsComponentProps.content && PaywallsComponentProps.content.payment_order) ? (
          <FormattedMessage id="ui.paywallsDialog.title.purchased" defaultMessage="ui.paywallsDialog.title.purchased" />
        ) : (
          <FormattedMessage id="ui.paywallsDialog.title" defaultMessage="ui.paywallsDialog.title" />
        )
      }
      scroll={'paper'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <Paywalls {...PaywallsComponentProps} />
    </Root>
  );
}
