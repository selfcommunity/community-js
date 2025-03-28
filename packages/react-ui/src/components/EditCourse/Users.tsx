import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AddUsersButton from '../../shared/AddUsersButton';
import {memo, useCallback, useEffect, useReducer, useRef} from 'react';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import Status from './Status';
import {PREFIX} from './constants';
import CourseUsersTable from '../../shared/CourseUsersTable';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {CourseService, CourseUserRoleParams, Endpoints, SCPaginatedResponse} from '@selfcommunity/api-services';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import {SCCourseUsersTableModeType} from '../../types/course';

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`,
  contrastColor: `${PREFIX}-contrast-color`
};

const headerCells = [
  {
    id: 'ui.editCourse.tab.users.table.header.name'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.role'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.registration'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.latestActivity'
  }
];

interface UsersProps {
  course: SCCourseType;
  endpointQueryParams?: Record<string, string | number>;
}

function Users(props: UsersProps) {
  // PROPS
  const {
    course,
    endpointQueryParams = {
      limit: 6,
      offset: DEFAULT_PAGINATION_OFFSET,
      statuses: JSON.stringify(['joined', 'manager', 'creator'])
    }
  } = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USERS_PARTECIPANTS_COURSES_STATE_CACHE_PREFIX_KEY, course.id),
      cacheStrategy: CacheStrategies.CACHE_FIRST,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  // CONTEXTS
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // REFS
  const updatedUsers = useRef(null);

  // CALLBACKS
  const _init = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      CourseService.getCourseDashboardUsers(course.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, course, dispatch, endpointQueryParams]);

  // HANDLERS
  const handleAddUser = useCallback(
    (_msg: string, user: SCUserType) => {
      dispatch({type: actionWidgetTypes.LOAD_PREVIOUS_SUCCESS, payload: {count: state.count + 1, results: [user], initialized: true}});
    },
    [state.count, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;
    if (scUserContext.user) {
      _t = setTimeout(_init);
      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, _init]);

  useEffect(() => {
    updatedUsers.current = PubSub.subscribe(`${SCTopicType.COURSE}.${SCGroupEventType.ADD_MEMBER}`, handleAddUser);

    return () => {
      updatedUsers.current && PubSub.unsubscribe(updatedUsers.current);
    };
  }, [handleAddUser]);

  const handleConfirm = useCallback(
    (newUsers: SCUserType[]) => {
      const data: CourseUserRoleParams = {
        joined: newUsers.map((user) => user.id)
      };

      CourseService.changeCourseUserRole(course.id, data)
        .then(() => {
          dispatch({
            type: actionWidgetTypes.LOAD_PREVIOUS_SUCCESS,
            payload: {count: state.count + newUsers.length, results: newUsers, initialized: true}
          });

          enqueueSnackbar(
            <FormattedMessage id="ui.editCourse.tab.users.table.snackbar.success" defaultMessage="ui.editCourse.tab.users.table.snackbar.success" />,
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [course, dispatch]
  );

  return (
    <Box>
      <Typography variant="h6" className={classes.contrastColor}>
        <FormattedMessage
          id="ui.editCourse.tab.users.title"
          defaultMessage="ui.editCourse.tab.users.title"
          values={{usersNumber: state.results.length}}
        />
      </Typography>

      <Stack className={classes.usersStatusWrapper}>
        <Status course={course} />

        <AddUsersButton
          label="ui.editCourse.tab.users.addUsersButton.label"
          endpoint={{
            url: () => Endpoints.GetCourseSuggestedUsers.url({id: course.id}),
            method: Endpoints.GetCourseSuggestedUsers.method
          }}
          onConfirm={handleConfirm}
        />
      </Stack>

      <CourseUsersTable
        course={course}
        state={state}
        dispatch={dispatch}
        headerCells={headerCells}
        mode={SCCourseUsersTableModeType.EDIT}
        emptyStatusTitle="ui.courseUsersTable.empty.users.title"
        emptyStatusDescription="ui.courseUsersTable.empty.users.description"
      />
    </Box>
  );
}

export default memo(Users);
