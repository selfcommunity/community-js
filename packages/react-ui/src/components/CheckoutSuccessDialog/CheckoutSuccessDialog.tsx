import React, {useEffect, useState} from 'react';
import {Slide} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCContentType} from '@selfcommunity/types';
import animatedProgress from '../../assets/onBoarding/progress/category_progress.json';
import {Player} from '@lottiefiles/react-lottie-player';

const PREFIX = 'SCCheckoutSuccessDialog';

const classes = {
  root: `${PREFIX}-root`,
  animationSuccess: `${PREFIX}-animation-success`
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

export interface CheckoutSuccessDialogProps extends BaseDialogProps {
  className?: string;
  checkoutSessionId: string;
  disableInitialTransition?: boolean;
}

export default function CheckoutSuccessDialog(inProps: CheckoutSuccessDialogProps) {
  // PROPS
  const props: CheckoutSuccessDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, checkoutSessionId, disableInitialTransition = false, ...rest} = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [contentType, setContentType] = useState<SCContentType | null>(null);
  const [contentId, setContentId] = useState<number | string | null>(null);

  useEffect(() => {
    /* PaymentApiClient.getCheckoutSession(checkoutSessionId)
      .then((r) => {
        // setContentType(r.content_type);
        // setContentId(r.id);
        setLoading(false);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      }); */
  }, []);

  const renderTitle = () => {
    return <Player autoplay loop src={animatedProgress} className={classes.animationSuccess} controls={false} />;
  };

  const renderContent = () => {
    return <FormattedMessage id="ui.paymentProductsDialog.title" defaultMessage="ui.paymentProductsDialog.title" />;
  };

  return (
    <Root
      maxWidth={'sm'}
      fullWidth
      title={renderTitle()}
      scroll={'paper'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      {renderContent()}
    </Root>
  );
}
