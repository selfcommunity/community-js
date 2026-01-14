import {Avatar, Button, Icon, IconButton, Skeleton, Stack, styled, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../BaseDialog';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  useSCPreferences,
  useSCRouting
} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import AccordionLessons from '../AccordionLessons';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import UserAvatar from '../UserAvatar';

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

interface SeeProgressButtonProps {
  course: SCCourseType;
  user: SCUserType;
}

function SeeProgressButton(props: SeeProgressButtonProps) {
  // PROPS
  const {course, user} = props;

  // STATES
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<SCCourseType | null>(null);

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const privateMessagingEnabled = useMemo(
    () => SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED in preferences && preferences[SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED].value,
    [preferences]
  );

  // EFFECTS
  useEffect(() => {
    if (open && !student) {
      CourseService.getSpecificCourseInfo(course.id, {user: user.id})
        .then((data) => setStudent(data))
        .catch((error) => Logger.error(SCOPE_SC_UI, error));
    }
  }, [open, student, course, user]);

  // HANDLERS
  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

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
                  <Link
                    {...(!course.created_by.deleted && {
                      to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, course.created_by)
                    })}>
                    <UserAvatar hide={!course.created_by.community_badge} smaller={true}>
                      <Avatar className={classes.avatar} src={user.avatar} alt={user.username} />
                    </UserAvatar>
                  </Link>
                  <Typography variant="body1">{user.username}</Typography>
                </Stack>

                {privateMessagingEnabled && (
                  <Button
                    component={Link}
                    to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, user)}
                    variant="outlined"
                    size="small"
                    color="inherit">
                    <Typography variant="body2">
                      <FormattedMessage id="ui.courseUsersTable.dialog.btn.label" defaultMessage="ui.courseUsersTable.dialog.btn.label" />
                    </Typography>
                  </Button>
                )}
              </Stack>

              {student ? (
                <Typography variant="body1">
                  <FormattedMessage
                    id="ui.courseUsersTable.dialog.info.text1"
                    defaultMessage="ui.courseUsersTable.dialog.info.text1"
                    values={{lessonsCompleted: student.num_lessons_completed}}
                  />
                </Typography>
              ) : (
                <Skeleton animation="wave" variant="text" width="100px" height="21px" />
              )}

              {student ? (
                <Typography variant="body1">
                  <FormattedMessage
                    id="ui.courseUsersTable.dialog.info.text2"
                    defaultMessage="ui.courseUsersTable.dialog.info.text2"
                    values={{courseCompleted: student.user_completion_rate}}
                  />
                </Typography>
              ) : (
                <Skeleton animation="wave" variant="text" width="100px" height="21px" />
              )}
            </Stack>

            <AccordionLessons course={student} viewerJoinStatus={course.join_status} />
          </Stack>
        </DialogRoot>
      )}
    </Fragment>
  );
}

export default memo(SeeProgressButton);
