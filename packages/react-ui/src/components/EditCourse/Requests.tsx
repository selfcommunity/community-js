import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {memo, useCallback, useEffect, useReducer, useRef} from 'react';
import {SCCourseType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Status from './Status';
import UsersSkeleton from './Users/Skeleton';
import CourseUsersTable from '../../shared/CourseUsersTable';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {CourseService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {PREFIX} from './constants';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`
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
  course: SCCourseType | null;
  endpointQueryParams?: Record<string, string | number>;
}

function Requests(props: RequestsProps) {
  // PROPS
  const {
    course,
    endpointQueryParams = {
      limit: 6,
      offset: DEFAULT_PAGINATION_OFFSET
    }
  } = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingPrevious: false,
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_REQUESTS_COURSES_STATE_CACHE_PREFIX_KEY, course?.id),
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

  useEffect(() => {
    updatedUsers.current = PubSub.subscribe(`${SCTopicType.COURSE}.${SCGroupEventType.REMOVE_MEMBER}`, handleRemoveUser);

    return () => {
      updatedUsers.current && PubSub.unsubscribe(updatedUsers.current);
    };
  }, []);

  // HANDLERS
  const handleRemoveUser = useCallback(
    (user: SCUserType) => {
      dispatch({
        type: actionWidgetTypes.SET_RESULTS,
        payload: {count: state.count - 1, results: state.results.filter((result: SCUserType) => result.id !== user.id)}
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
          id="ui.editCourse.tab.requests.title"
          defaultMessage="ui.editCourse.tab.requests.title"
          values={{requestsNumber: state.results.length}}
        />
      </Typography>

      <Stack className={classes.usersStatusWrapper}>
        <Status course={course} />
      </Stack>

      <CourseUsersTable course={course} state={state} dispatch={dispatch} headerCells={headerCells} mode="requests" />
    </Box>
  );
}

export default memo(Requests);
