import {Avatar, Button, Icon, IconButton, Stack, styled, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, memo, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../BaseDialog';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import {SCCourseLessonType, SCCourseSectionType, SCCourseType, SCUserType} from '@selfcommunity/types';
import AccordionLessons from '../AccordionLessons';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';

const classes = {
  dialogRoot: `${PREFIX}-dialog-root`,
  contentWrapper: `${PREFIX}-content-wrapper`,
  infoOuterWrapper: `${PREFIX}-info-outer-wrapper`,
  infoInnerWrapper: `${PREFIX}-info-inner-wrapper`,
  avatarWrapper: `${PREFIX}-avatar-wrapper`,
  avatar: `${PREFIX}-avatar`
};

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

interface ActionButtonProps {
  course: SCCourseType;
  user: SCUserType;
}

function ActionButton(props: ActionButtonProps) {
  // PROPS
  const {course, user} = props;

  // STATES
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<SCCourseType | null>(null);
  const [sections, setSections] = useState<SCCourseSectionType[] | null>(null);
  const [lessons, setLessons] = useState<SCCourseLessonType[] | null>(null);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // EFFECTS
  useEffect(() => {
    if (open && !student) {
      CourseService.getSpecificCourseInfo(course.id, {user: user.id})
        .then((data) => setStudent(data))
        .catch((error) => Logger.error(SCOPE_SC_UI, error));

      CourseService.getCourseSections(course.id)
        .then((data) => setSections(data))
        .catch((error) => Logger.error(SCOPE_SC_UI, error));

      if (sections && sections.length > 0) {
        sections.forEach((section) => {
          if (section.lessons_order.length > 0) {
            CourseService.getCourseLessons(course.id, section.id)
              .then((data) => setLessons((prev) => (prev ? [...prev, ...data] : data)))
              .catch((error) => Logger.error(SCOPE_SC_UI, error));
          }
        });
      }
    }
  }, [open, student, sections]);

  // HANDLERS
  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const handleClick = useCallback(() => {
    // TODO
  }, []);

  return (
    <Fragment>
      {isMobile ? (
        <IconButton size="small" color="inherit" onClick={handleToggleOpen}>
          <Icon>chevron_right</Icon>
        </IconButton>
      ) : (
        <Button variant="outlined" size="small" color="inherit" onClick={handleToggleOpen}>
          <Typography variant="body2">
            <FormattedMessage id="ui.courseUsersTable.action.btn.label" defaultMessage="ui.courseUsersTable.action.btn.label" />
          </Typography>
        </Button>
      )}

      {open && (
        <DialogRoot
          DialogContentProps={{dividers: isMobile}}
          open
          scroll="paper"
          onClose={handleToggleOpen}
          title={
            <Typography variant="h3">
              <FormattedMessage id="ui.courseUsersTable.dialog.title" defaultMessage="ui.courseUsersTable.dialog.title" />
            </Typography>
          }
          className={classes.dialogRoot}>
          <Stack className={classes.contentWrapper}>
            <Stack className={classes.infoOuterWrapper}>
              <Stack className={classes.infoInnerWrapper}>
                <Stack className={classes.avatarWrapper}>
                  <Avatar className={classes.avatar} src={user.avatar} alt={user.username} />
                  <Typography variant="body1">{user.username}</Typography>
                </Stack>

                <Button variant="outlined" size="small" color="inherit" onClick={handleClick}>
                  <Typography variant="body2">
                    <FormattedMessage id="ui.courseUsersTable.dialog.btn.label" defaultMessage="ui.courseUsersTable.dialog.btn.label" />
                  </Typography>
                </Button>
              </Stack>

              <Typography variant="body1">
                <FormattedMessage
                  id="ui.courseUsersTable.dialog.info.text1"
                  defaultMessage="ui.courseUsersTable.dialog.info.text1"
                  values={{lessonsCompleted: student?.num_lessons_completed}}
                />
              </Typography>

              <Typography variant="body1">
                <FormattedMessage
                  id="ui.courseUsersTable.dialog.info.text2"
                  defaultMessage="ui.courseUsersTable.dialog.info.text2"
                  values={{courseCompleted: student?.user_completion_rate}}
                />
              </Typography>
            </Stack>

            <AccordionLessons sections={sections} lessons={lessons} />
          </Stack>
        </DialogRoot>
      )}
    </Fragment>
  );
}

export default memo(ActionButton);
