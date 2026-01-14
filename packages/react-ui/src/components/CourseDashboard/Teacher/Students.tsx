import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {memo, useCallback, useEffect, useReducer} from 'react';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import CourseUsersTable from '../../../shared/CourseUsersTable';
import {CourseDashboardUsersParams, CourseService, Endpoints, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../../utils/widget';
import {DEFAULT_PAGINATION_OFFSET} from '../../../constants/Pagination';
import {SCCourseUsersTableModeType} from '../../../types/course';

const headerCells = [
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.name'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.progress'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.registration'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.latestActivity'
  },
  {}
];

interface StudentsProps {
  course: SCCourseType;
  endpointQueryParams?: CourseDashboardUsersParams;
}

function Students(props: StudentsProps) {
  // PROPS
  const {course, endpointQueryParams = {limit: 6, offset: DEFAULT_PAGINATION_OFFSET}} = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.STUDENTS_PARTECIPANTS_COURSES_STATE_CACHE_PREFIX_KEY, course.id),
      cacheStrategy: CacheStrategies.NETWORK_ONLY,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();

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
  }, [state.isLoadingNext, state.initialized, course, dispatch]);

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

  return (
    <CourseUsersTable
      state={state}
      dispatch={dispatch}
      course={course}
      endpointSearch={{
        url: () => Endpoints.GetCourseDashboardUsers.url({id: course.id}),
        method: Endpoints.GetCourseDashboardUsers.method
      }}
      headerCells={headerCells}
      mode={SCCourseUsersTableModeType.DASHBOARD}
      emptyStatusTitle="ui.courseUsersTable.empty.users.title"
      emptyStatusDescription="ui.courseUsersTable.empty.users.description"
    />
  );
}

export default memo(Students);
