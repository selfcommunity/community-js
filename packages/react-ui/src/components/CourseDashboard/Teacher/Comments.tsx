import {Avatar, Box, Button, Divider, Skeleton, Stack, Typography} from '@mui/material';
import {SCCourseCommentType, SCCourseType} from '@selfcommunity/types';
import {Fragment, memo, useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {FormattedDate, FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import {PREFIX} from '../constants';
import {DEFAULT_PAGINATION_OFFSET} from '../../../constants/Pagination';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../../utils/widget';
import {Link, SCCache, SCRoutes, SCRoutingContextType, SCUserContextType, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import {CourseService, Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {AxiosResponse} from 'axios';

const classes = {
  container: `${PREFIX}-comments-container`,
  outerWrapper: `${PREFIX}-outer-wrapper`,
  innerWrapper: `${PREFIX}-inner-wrapper`,
  userWrapper: `${PREFIX}-user-wrapper`,
  avatar: `${PREFIX}-avatar`,
  userInfo: `${PREFIX}-user-info`,
  circle: `${PREFIX}-circle`,
  button: `${PREFIX}-button`,
  contrastColor: `${PREFIX}-contrast-color`
};

interface CommentsProps {
  course: SCCourseType;
  endpointQueryParams?: Record<string, string | number>;
}

function CommentSkeleton({id}: {id: number}) {
  return (
    <Box className={classes.outerWrapper}>
      <Skeleton animation="wave" variant="text" width="90px" height="21px" />
      <Divider />
      <Stack className={classes.innerWrapper}>
        {Array.from(new Array(id)).map((_, i) => (
          <Stack key={i} className={classes.userWrapper}>
            <Skeleton animation="wave" variant="circular" className={classes.avatar} />

            <Box>
              <Stack className={classes.userInfo}>
                <Skeleton animation="wave" variant="text" width="90px" height="21px" />
                <Box className={classes.circle} />

                <Skeleton animation="wave" variant="text" width="90px" height="21px" />
              </Stack>

              <Skeleton animation="wave" variant="text" width="180px" height="21px" />
            </Box>
          </Stack>
        ))}

        <Skeleton animation="wave" variant="rounded" width="112px" height="36px" className={classes.button} />
      </Stack>
    </Box>
  );
}

function CommentsSkeleton() {
  return (
    <Box className={classes.container}>
      <Skeleton animation="wave" variant="text" width="90px" height="21px" />

      {Array.from(new Array(2)).map((_, i) => (
        <CommentSkeleton key={i} id={4} />
      ))}

      <Skeleton animation="wave" variant="rounded" width="88px" height="36px" />
    </Box>
  );
}

function Comments(props: CommentsProps) {
  // PROPS
  const {course, endpointQueryParams = {limit: 3, offset: DEFAULT_PAGINATION_OFFSET}} = props;

  // STATES
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_COMMENTS_COURSES_STATE_CACHE_PREFIX_KEY, course.id),
      cacheStrategy: CacheStrategies.CACHE_FIRST,
      visibleItems: endpointQueryParams.limit
    },
    stateWidgetInitializer
  );

  const [isLoading, setIsLoading] = useState(false);

  // CONTEXTS
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CALLBACKS
  const _init = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});

      CourseService.getCourseComments(course.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCCourseCommentType>) => {
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

  // HANDLERS
  const handleNext = useCallback(() => {
    setIsLoading(true);
    dispatch({type: actionWidgetTypes.LOADING_NEXT});

    http
      .request({
        url: state.next,
        method: Endpoints.GetCourseComments.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCCourseCommentType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        setIsLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, dispatch, setIsLoading]);

  // MEMOS
  const renderComments = useMemo(() => {
    const map = new Map();
    state.results.forEach((comment: SCCourseCommentType) => {
      const name = comment.extras.lesson.name;

      if (!map.has(name)) {
        map.set(name, [comment]);
      } else {
        map.set(name, [...map.get(name), comment]);
      }
    });

    return Array.from(map.entries()).map(([name, comments]) => (
      <Box key={name} className={classes.outerWrapper}>
        <Typography variant="h5">{name}</Typography>
        <Divider />
        <Stack className={classes.innerWrapper}>
          {comments.map((comment: SCCourseCommentType) => (
            <Stack key={comment.id} className={classes.userWrapper}>
              <Avatar src={comment.created_by.avatar} alt={comment.created_by.username} className={classes.avatar} />

              <Box>
                <Stack className={classes.userInfo}>
                  <Typography variant="body1">{comment.created_by.username}</Typography>

                  <Box className={classes.circle} />

                  <Typography variant="body2">
                    <FormattedDate value={comment.created_at} />
                  </Typography>
                </Stack>

                <Typography variant="body1" component="div" dangerouslySetInnerHTML={{__html: comment.html}} />
              </Box>
            </Stack>
          ))}

          <Button
            component={Link}
            to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, course)}
            size="small"
            variant="outlined"
            color="inherit"
            className={classes.button}>
            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.dashboard.teacher.tab.comments.lessons.btn.label"
                defaultMessage="ui.course.dashboard.teacher.tab.comments.lessons.btn.label"
              />
            </Typography>
          </Button>
        </Stack>
      </Box>
    ));
  }, [state.results]);

  if (!state.initialized) {
    return <CommentsSkeleton />;
  }

  return (
    <Box className={classes.container}>
      {state.count > 0 ? (
        <Fragment>
          <Typography variant="body1">
            <FormattedMessage
              id="ui.course.dashboard.teacher.tab.comments.number"
              defaultMessage="ui.course.dashboard.teacher.tab.comments.number"
              values={{commentsNumber: state.count}}
            />
          </Typography>

          {renderComments}

          {isLoading && <CommentSkeleton id={1} />}

          <LoadingButton size="small" variant="outlined" color="inherit" loading={isLoading} disabled={!state.next} onClick={handleNext}>
            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.dashboard.teacher.tab.comments.btn.label"
                defaultMessage="ui.course.dashboard.teacher.tab.comments.btn.label"
              />
            </Typography>
          </LoadingButton>
        </Fragment>
      ) : (
        <Typography variant="body2">
          <FormattedMessage id="ui.course.dashboard.teacher.tab.comments.empty" defaultMessage="ui.course.dashboard.teacher.tab.comments.empty" />
        </Typography>
      )}
    </Box>
  );
}

export default memo(Comments);
