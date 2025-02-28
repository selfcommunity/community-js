import React from 'react';
import {Slide, Dialog, DialogTitle} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import ContentObjectProducts from '../ContentObjectProducts';
import {ContentObjectPricesProps} from '../ContentObjectProducts/ContentObjectProducts';
import {FormattedMessage} from 'react-intl';
import DialogContent from '@mui/material/DialogContent';

const PREFIX = 'SCContentObjectPricesDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({

}));

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

export default function ContentObjectProductsDialog(inProps: ContentObjectPricesDialogProps) {
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
      title={<FormattedMessage id="ui.contentObjectProductsDialog.title" defaultMessage="ui.contentObjectProductsDialog.title" />}
      scroll={'paper'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <ContentObjectProducts {...ContentObjectPricesComponentProps} />
    </Root>
  );
}
