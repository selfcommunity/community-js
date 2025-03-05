import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Dialog, DialogContent, DialogProps, DialogTitle, Slide, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {FormattedMessage, useIntl} from 'react-intl';
import {SCCheckoutSessionStatus, SCContentType} from '@selfcommunity/types';
import {CLAPPING} from '../../assets/courses/clapping';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import Event from '../Event';
import {SCEventTemplateType} from '../../types/event';
import {SCCourseTemplateType} from '../../types/course';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Category from '../Category';
import Course from '../Course';
import Group from '../Group';

const PREFIX = 'SCCheckoutReturnDialog';

const classes = {
  root: `${PREFIX}-root`,
  img: `${PREFIX}-img`,
  contentObject: `${PREFIX}-content-object`,
  object: `${PREFIX}-object`,
  btn: `${PREFIX}-btn`
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

export interface CheckoutReturnDialogProps extends DialogProps {
  className?: string;
  checkoutSessionId: string;
  disableInitialTransition?: boolean;
}

export default function CheckoutReturnDialog(inProps: CheckoutReturnDialogProps) {
  // PROPS
  const props: CheckoutReturnDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, checkoutSessionId, disableInitialTransition = false, ...rest} = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [contentType, setContentType] = useState<SCContentType | null>(null);
  const [contentId, setContentId] = useState<number | null>(null);

  // HOOKS
  const intl = useIntl();

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  useEffect(() => {
    PaymentApiClient.getCheckoutSession({session_id: checkoutSessionId})
      .then((r) => {
        setContentType(r.metadata.content_type);
        setContentId(parseInt(r.metadata.content_id));
        if (r.status === SCCheckoutSessionStatus.COMPLETE) {
          PaymentApiClient.checkoutCompleteSession({session_id: checkoutSessionId}).then((r) => {
            setLoading(false);
          });
        } else if (r.status === SCCheckoutSessionStatus.OPEN) {
          Logger.info(SCOPE_SC_UI, 'Status session: open. Payment is in status pending!');
        }
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  }, []);

  const renderTitle = () => {
    return <>{!loading && <FormattedMessage id="ui.checkoutSuccessDialog.title" defaultMessage="ui.checkoutSuccessDialog.title" />}</>;
  };

  const renderContent = () => {
    let footer;
    if (contentType === SCContentType.EVENT) {
      footer = (
        <>
          <Box className={classes.contentObject}>
            <Event eventId={contentId} template={SCEventTemplateType.PREVIEW} actions={<></>} variant="outlined" className={classes.object} />
          </Box>
          <Button
            size="medium"
            variant={'contained'}
            to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, {id: contentId})}
            component={Link}
            className={classes.btn}>
            <FormattedMessage id="ui.checkoutSuccessDialog.event.button" defaultMessage="ui.checkoutSuccessDialog.event.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.CATEGORY) {
      footer = (
        <>
          <Box className={classes.contentObject}>
            <Category categoryId={contentId} actions={<></>} variant="outlined" className={classes.object} />
          </Box>
          <Button
            size="medium"
            variant={'contained'}
            to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, {id: contentId})}
            component={Link}
            className={classes.btn}>
            <FormattedMessage id="ui.checkoutSuccessDialog.category.button" defaultMessage="ui.checkoutSuccessDialog.category.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.COURSE) {
      footer = (
        <>
          <Box className={classes.contentObject}>
            <Course
              courseId={contentId}
              template={SCCourseTemplateType.PREVIEW}
              actions={<></>}
              hideEventParticipants
              hideEventPlanner
              variant="outlined"
              className={classes.object}
            />
          </Box>
          <Button
            size="medium"
            variant={'contained'}
            to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, {id: contentId})}
            component={Link}
            className={classes.btn}>
            <FormattedMessage id="ui.checkoutSuccessDialog.course.button" defaultMessage="ui.checkoutSuccessDialog.course.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.GROUP) {
      footer = (
        <>
          <Box className={classes.contentObject}>
            <Group courseId={contentId} actions={<></>} hideEventParticipants hideEventPlanner variant="outlined" className={classes.object} />
          </Box>
          <Button
            size="medium"
            variant={'contained'}
            to={scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, {id: contentId})}
            component={Link}
            className={classes.btn}>
            <FormattedMessage id="ui.checkoutSuccessDialog.category.button" defaultMessage="ui.checkoutSuccessDialog.category.button" />
          </Button>
        </>
      );
    }
    return (
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <img
          src={CLAPPING}
          className={classes.img}
          alt={intl.formatMessage({
            id: 'ui.checkoutSuccessDialog.buy',
            defaultMessage: 'ui.checkoutSuccessDialog.buy'
          })}
          width={100}
          height={100}
        />
        <Typography variant="body2" color="textSecondary">
          <FormattedMessage id="ui.checkoutSuccessDialog.buy" defaultMessage="ui.checkoutSuccessDialog.buy" />
        </Typography>
        {footer}
      </Stack>
    );
  };

  return (
    <Root
      maxWidth={'sm'}
      fullWidth
      scroll={'paper'}
      open
      {...(disableInitialTransition ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      {...rest}>
      <DialogTitle>{renderTitle()}</DialogTitle>
      <DialogContent>{loading ? <CircularProgress /> : renderContent()}</DialogContent>
    </Root>
  );
}
