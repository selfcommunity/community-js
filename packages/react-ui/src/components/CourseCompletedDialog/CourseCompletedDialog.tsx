import BaseDialog from '../../shared/BaseDialog';
import {Button, Stack, styled, Typography, useThemeProps} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import clapping from '../../assets/courses/clapping';
import {SCCourseType} from '@selfcommunity/types';
import {memo} from 'react';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';

const PREFIX = 'SCCourseCompletedDialog';

const classes = {
  root: `${PREFIX}-root`,
  wrapper: `${PREFIX}-wrapper`,
  title: `${PREFIX}-title`,
  descriptionPt1: `${PREFIX}-description-pt1`,
  descriptionPt2: `${PREFIX}-description-pt2`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface CourseCompletedDialogProps {
  course: SCCourseType;
  onClose: () => void;
}

function CourseCompletedDialog(inProps: CourseCompletedDialogProps) {
  // PROPS
  const props: CourseCompletedDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {course, onClose} = props;

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();

  return (
    <Root
      DialogContentProps={{dividers: false}}
      open
      onClose={onClose}
      actions={
        <Button component={Link} to={scRoutingContext.url(SCRoutes.COURSES_ROUTE_NAME, {})} size="medium" variant="contained">
          <Typography variant="body1">
            <FormattedMessage id="ui.course.completedDialog.btn.label" defaultMessage="ui.course.completedDialog.btn.label" />
          </Typography>
        </Button>
      }
      className={classes.root}>
      <Stack className={classes.wrapper}>
        <img
          src={clapping}
          alt={intl.formatMessage({id: 'ui.course.completedDialog.title', defaultMessage: 'ui.course.completedDialog.title'})}
          width={100}
          height={100}
        />
        <Typography variant="h2" className={classes.title}>
          <FormattedMessage id="ui.course.completedDialog.title" defaultMessage="ui.course.completedDialog.title" />
        </Typography>

        <Typography variant="h4" className={classes.descriptionPt1}>
          <FormattedMessage id="ui.course.completedDialog.description.pt1" defaultMessage="ui.course.completedDialog.description.pt1" />
        </Typography>

        <Typography variant="h4" className={classes.descriptionPt2}>
          {intl.formatMessage(
            {id: 'ui.course.completedDialog.description.pt2', defaultMessage: 'ui.course.completedDialog.description.pt2'},
            {
              courseName: course.name,
              span: (chunks) => (
                <Typography key="ui.course.completedDialog.description.pt2.span" component="span" variant="inherit" color="primary">
                  {chunks}
                </Typography>
              )
            }
          )}
        </Typography>
      </Stack>
    </Root>
  );
}

export default memo(CourseCompletedDialog);
