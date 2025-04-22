import React from 'react';
import {AppBar, Grid, IconButton, Slide, Icon, Toolbar, Typography, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import PdfPreview, {PdfPreviewProps} from '../PdfPreview';

const PREFIX = 'SCPdfPreviewDialog';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`
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

export interface PdfPreviewDialogProps extends BaseDialogProps {
  className?: string;
  title: string | React.ReactElement;
  PdfPreviewComponentProps: PdfPreviewProps;
  pdfUrl: string;
  disableInitialTransition?: boolean;
}

export default function PdfPreviewDialog(inProps: PdfPreviewDialogProps) {
  // PROPS
  const props: PdfPreviewDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, title, pdfUrl, disableInitialTransition = false, onClose, PdfPreviewComponentProps = {}, ...rest} = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root
      fullScreen
      scroll={'paper'}
      open
      maxWidth={'md'}
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <AppBar sx={{position: 'fixed', top: 0}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            {title}
          </Typography>
          {pdfUrl && (
            <IconButton edge="end" color="inherit" href={pdfUrl} aria-label="close">
              <Icon>download</Icon>
            </IconButton>
          )}
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ml: 2}}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.content}>
        <Grid item xs={12} justifyContent={'center'} alignContent={'center'}>
          <PdfPreview hideDownloadLink {...PdfPreviewComponentProps} pdfUrl={pdfUrl} />
        </Grid>
      </Grid>
    </Root>
  );
}
