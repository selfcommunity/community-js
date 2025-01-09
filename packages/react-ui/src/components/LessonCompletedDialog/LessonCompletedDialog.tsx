import BaseDialog from '../../shared/BaseDialog';
import {Button, Stack, styled, Typography, useThemeProps} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import {IMAGE} from './image';
import {SCCourseType} from '@selfcommunity/types';

const PREFIX = 'SCLessonCompletedDialog';

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

export interface LessonCompletedDialogProps {
  course: SCCourseType;
  open: boolean;
  onAction?: () => void;
  onClose?: () => void;
}

export default function LessonCompletedDialog(inProps: LessonCompletedDialogProps) {
  // PROPS
  const props: LessonCompletedDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {course, open, onAction, onClose} = props;

  // HOOKS
  const intl = useIntl();

  return (
    <Root
      DialogContentProps={{dividers: false}}
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onAction} size="medium" variant="contained">
          <Typography variant="body1">
            <FormattedMessage id="ui.course.completedDialog.btn.label" defaultMessage="ui.course.completedDialog.btn.label" />
          </Typography>
        </Button>
      }
      className={classes.root}>
      <Stack className={classes.wrapper}>
        <img
          src={IMAGE}
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
                <Typography component="span" variant="inherit" color="primary">
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
