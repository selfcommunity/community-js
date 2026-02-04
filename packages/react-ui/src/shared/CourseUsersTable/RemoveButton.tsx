import {Button, Icon} from '@mui/material';
import {CourseService} from '@selfcommunity/api-services';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {forwardRef, memo, Ref, useCallback, useImperativeHandle, useState} from 'react';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import PubSub from 'pubsub-js';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {SCCourseEditManageUserProps, SCCourseEditManageUserRef, SCCourseEditTabType} from '../../types/course';

interface RemoveButtonProps {
  course: SCCourseType;
  user: SCUserType;
  handleOpenDialog: (tab: SCCourseEditManageUserProps) => void;
}

function RemoveButton(props: RemoveButtonProps, ref: Ref<SCCourseEditManageUserRef>) {
  // PROPS
  const {course, user, handleOpenDialog} = props;

  // STATES
  const [loading, setLoading] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS

  const handleSubmit = useCallback(
    (userToRemove: SCUserType) => {
      setLoading(true);

      const params: {user: number} = {
        user: userToRemove.id
      };

      CourseService.leaveOrRemoveCourseRequest(course.id, params)
        .then(() => {
          setLoading(false);
          PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.REMOVE_MEMBER}`, userToRemove);

          enqueueSnackbar(
            <FormattedMessage id="ui.editCourse.tab.users.table.snackbar.removed" defaultMessage="ui.editCourse.tab.users.table.snackbar.removed" />,
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
    [course, setLoading]
  );

  useImperativeHandle(
    ref,
    () => ({
      handleManageUser: (userToRemove: SCUserType) => handleSubmit(userToRemove)
    }),
    [handleSubmit]
  );

  return (
    <Button
      size="small"
      color="inherit"
      variant="outlined"
      onClick={() => handleOpenDialog({tab: SCCourseEditTabType.USERS, user})}
      loading={loading}
      disabled={loading}>
      <Icon>close</Icon>
    </Button>
  );
}

export default memo(forwardRef(RemoveButton));
