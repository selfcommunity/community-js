import React from 'react';
import {Slide, Dialog} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {BaseDialogProps} from '../../shared/BaseDialog';
import ContentObjectPrices from '../ContentObjectPrices';
import {ContentObjectPricesProps} from '../ContentObjectPrices/ContentObjectPrices';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCContentObjectPricesDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Dialog, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

const Transition = React.forwardRef(function Transition(props: TransitionProps & {children: React.ReactElement}, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoTransition = React.forwardRef(function NoTransition(props: {children: React.ReactElement}, ref) {
  return <React.Fragment> {props.children} </React.Fragment>;
});

export interface ContentObjectPricesDialogProps extends BaseDialogProps {
  className?: string;
  ContentObjectPricesComponentProps: ContentObjectPricesProps;
  disableInitialTransition?: boolean;
}

export default function ContentObjectPricesDialog(inProps: ContentObjectPricesDialogProps) {
  // PROPS
  const props: ContentObjectPricesDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ContentObjectPricesComponentProps = {}, disableInitialTransition = false, ...rest} = props;

  return (
    <Root
      maxWidth={'sm'}
      fullWidth
      scroll={'paper'}
      title={'Scegli tra i seguenti prodotti'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <ContentObjectPrices {...ContentObjectPricesComponentProps} />
    </Root>
  );
}
