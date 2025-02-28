import {LoadingButton} from '@mui/lab';
import {Icon, Stack} from '@mui/material';
import {CourseService} from '@selfcommunity/api-services';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {memo, useCallback, useState} from 'react';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {PREFIX} from './constants';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';

const classes = {
  requestButtonWrapper: `${PREFIX}-request-button-wrapper`
};

interface RequestButtonProps {
  course: SCCourseType;
  user: SCUserType;
}

function RequestButton(props: RequestButtonProps) {
  // PROPS
  const {course, user} = props;

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
        PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.ADD_MEMBER}`, user);
        PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.REMOVE_MEMBER}`, user);

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

  const handleReject = useCallback(() => {
    setRejectLoading(true);

    const params: {user: number} = {
      user: user.id
    };

    CourseService.leaveOrRemoveCourseRequest(course.id, params)
      .then(() => {
        setRejectLoading(false);
        PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.REMOVE_MEMBER}`, user);

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
  }, [course, user, setRejectLoading]);

  return (
    <Stack className={classes.requestButtonWrapper}>
      <LoadingButton size="small" color="primary" variant="outlined" onClick={handleAccept} loading={acceptLoading} disabled={acceptLoading}>
        <Icon>check</Icon>
      </LoadingButton>

      <LoadingButton size="small" color="inherit" variant="outlined" onClick={handleReject} loading={rejectLoading} disabled={rejectLoading}>
        <Icon>close</Icon>
      </LoadingButton>
    </Stack>
  );
}

export default memo(RequestButton);
