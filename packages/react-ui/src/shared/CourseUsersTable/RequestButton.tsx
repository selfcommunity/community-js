import {Button, Icon, Stack} from '@mui/material';
import {CourseService} from '@selfcommunity/api-services';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {forwardRef, memo, Ref, useCallback, useImperativeHandle, useState} from 'react';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {PREFIX} from './constants';
import PubSub from 'pubsub-js';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {SCCourseEditManageUserProps, SCCourseEditManageUserRef, SCCourseEditTabType} from '../../types/course';

const classes = {
  requestButtonWrapper: `${PREFIX}-request-button-wrapper`
};

interface RequestButtonProps {
  course: SCCourseType;
  user: SCUserType;
  handleOpenDialog: (tab: SCCourseEditManageUserProps) => void;
}

function RequestButton(props: RequestButtonProps, ref: Ref<SCCourseEditManageUserRef>) {
  // PROPS
  const {course, user, handleOpenDialog} = props;

  // STATES
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleAccept = useCallback(() => {
    setAcceptLoading(true);

    const data: {users: number[]} = {
      users: [user.id]
    };

    CourseService.inviteOrAcceptUsersToCourse(course.id, data)
      .then(() => {
        setAcceptLoading(false);
        PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.ADD_MEMBER}`, user);
        PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.REJECT_MEMBER}`, user);

        enqueueSnackbar(
          <FormattedMessage
            id="ui.editCourse.tab.requests.table.snackbar.accepted"
            defaultMessage="ui.editCourse.tab.requests.table.snackbar.accepted"
          />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [course, user, setAcceptLoading]);

  const handleReject = useCallback(
    (userToReject: SCUserType) => {
      setRejectLoading(true);

      const params: {user: number} = {
        user: userToReject.id
      };

      CourseService.leaveOrRemoveCourseRequest(course.id, params)
        .then(() => {
          setRejectLoading(false);
          PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.REJECT_MEMBER}`, userToReject);

          enqueueSnackbar(
            <FormattedMessage
              id="ui.editCourse.tab.requests.table.snackbar.rejected"
              defaultMessage="ui.editCourse.tab.requests.table.snackbar.rejected"
            />,
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [course, setRejectLoading]
  );

  useImperativeHandle(
    ref,
    () => ({
      handleManageUser: (userToReject: SCUserType) => handleReject(userToReject)
    }),
    [handleReject]
  );

  return (
    <Stack className={classes.requestButtonWrapper}>
      <Button size="small" color="primary" variant="outlined" onClick={handleAccept} loading={acceptLoading} disabled={acceptLoading}>
        <Icon>check</Icon>
      </Button>

      <Button
        size="small"
        color="inherit"
        variant="outlined"
        onClick={() => handleOpenDialog({tab: SCCourseEditTabType.REQUESTS, request: user})}
        loading={rejectLoading}
        disabled={rejectLoading}>
        <Icon>close</Icon>
      </Button>
    </Stack>
  );
}

export default memo(forwardRef(RequestButton));
