import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {memo, SyntheticEvent, useCallback, useEffect, useReducer, useRef} from 'react';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Status from './Status';
import CourseUsersTable from '../../shared/CourseUsersTable';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {BaseGetParams, CourseService, Endpoints, SCPaginatedResponse} from '@selfcommunity/api-services';
import {PREFIX} from './constants';
import PubSub from 'pubsub-js';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {SCCourseEditTabType, SCCourseUsersTableModeType} from '../../types/course';

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`,
  contrastColor: `${PREFIX}-contrast-color`
};

const headerCells = [
  {
    id: 'ui.editCourse.tab.users.table.header.name'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.registration'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.latestActivity'
  },
  {}
];

interface RequestsProps {
  course: SCCourseType;
  endpointQueryParams?: BaseGetParams;
  handleTabChange: (_e: SyntheticEvent, newTabValue: SCCourseEditTabType) => void;
}

function Requests(props: RequestsProps) {
  // PROPS
  const {
    course,
    endpointQueryParams = {
      limit: 6,
      offset: DEFAULT_PAGINATION_OFFSET
    },
    handleTabChange
  } = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingPrevious: false,
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USERS_REQUESTS_COURSES_STATE_CACHE_PREFIX_KEY, course.id),
      cacheStrategy: CacheStrategies.CACHE_FIRST,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  // CONTEXTS
  const scUserContext: SCUserContextType = useSCUser();

  // REFS
  const updatedUsers = useRef(null);

  // CALLBACKS
  const _init = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      CourseService.getCourseWaitingApproval(course.id, {...endpointQueryParams})
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
  const handleRejectUser = useCallback(
    (_msg: string, user: SCUserType) => {
      dispatch({
        type: actionWidgetTypes.SET_RESULTS,
        payload: {count: state.results.length - 1, results: state.results.filter((result: SCUserType) => result.id !== user.id)}
      });
    },
    [state.count, state.results, dispatch]
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
    updatedUsers.current = PubSub.subscribe(`${SCTopicType.COURSE}.${SCCourseEventType.REJECT_MEMBER}`, handleRejectUser);

    return () => {
      updatedUsers.current && PubSub.unsubscribe(updatedUsers.current);
    };
  }, [handleRejectUser]);

  return (
    <Box>
      <Typography variant="h6" className={classes.contrastColor}>
        <FormattedMessage
          id="ui.editCourse.tab.requests.title"
          defaultMessage="ui.editCourse.tab.requests.title"
          values={{requestsNumber: state.results.length}}
        />
      </Typography>

      <Stack className={classes.usersStatusWrapper}>
        <Status course={course} handleTabChange={handleTabChange} />
      </Stack>

      <CourseUsersTable
        state={state}
        dispatch={dispatch}
        course={course}
        endpointSearch={{
          url: () => Endpoints.GetCourseWaitingApproval.url({id: course.id}),
          method: Endpoints.GetCourseWaitingApproval.method
        }}
        headerCells={headerCells}
        mode={SCCourseUsersTableModeType.REQUESTS}
        emptyStatusTitle="ui.courseUsersTable.empty.requests.title"
      />
    </Box>
  );
}

export default memo(Requests);
