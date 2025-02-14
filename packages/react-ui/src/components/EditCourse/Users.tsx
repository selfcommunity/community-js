import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AddUsersButton from '../../shared/AddUsersButton';
import {useCallback, useEffect, useReducer} from 'react';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import Status from './Status';
import UsersSkeleton from './Users/Skeleton';
import {PREFIX} from './constants';
import CourseUsersTable from '../../shared/CourseUsersTable';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {CourseService, Endpoints, SCPaginatedResponse} from '@selfcommunity/api-services';

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`
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
  course: SCCourseType | null;
  endpointQueryParams?: Record<string, string | number>;
}

export default function Users(props: UsersProps) {
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
      isLoadingPrevious: false,
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_PARTECIPANTS_COURSES_STATE_CACHE_PREFIX_KEY, course?.id),
      cacheStrategy: CacheStrategies.CACHE_FIRST,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // CALLBACKS
  const _init = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      CourseService.getCourseJoinedUsers(course.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, course, dispatch]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && course) {
      _t = setTimeout(_init);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, course, _init]);

  // HANDLERS
  const handleConfirm = useCallback(
    (newUsers: SCUserType[]) => {
      CourseService.changeCourseUserRole(course.id, {joined: newUsers.map((user) => user.id)})
        .then(() => {
          dispatch({type: actionWidgetTypes.RESET});
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [dispatch]
  );

  if (!course) {
    return <UsersSkeleton />;
  }

  return (
    <Box>
      <Typography variant="h6">
        <FormattedMessage
          id="ui.editCourse.tab.users.title"
          defaultMessage="ui.editCourse.tab.users.title"
          values={{usersNumber: state.results.length}}
        />
      </Typography>

      <Stack className={classes.usersStatusWrapper}>
        <Status course={course} />

        <AddUsersButton
          course={course}
          label="ui.editCourse.tab.users.addUsersButton.label"
          endpoint={{
            url: Endpoints.GetCourseSuggestedUsers.url,
            method: Endpoints.GetCourseSuggestedUsers.method
          }}
          onConfirm={handleConfirm}
          isUpdating={state.isLoadingPrevious}
        />
      </Stack>

      <CourseUsersTable course={course} state={state} dispatch={dispatch} headerCells={headerCells} editMode />
    </Box>
  );
}
