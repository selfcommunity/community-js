import {Avatar, Box, Button, Divider, Skeleton, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {useCallback, useEffect, useState} from 'react';
import {CommentsType} from '../types';
import {getCommentsData, getOtherCommentsData} from '../../EditCourse/data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from 'packages/react-ui/src/constants/Errors';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import {PREFIX} from '../constants';

const classes = {
  container: `${PREFIX}-comments-container`,
  outerWrapper: `${PREFIX}-outer-wrapper`,
  innerWrapper: `${PREFIX}-inner-wrapper`,
  userWrapper: `${PREFIX}-user-wrapper`,
  avatar: `${PREFIX}-avatar`,
  userInfo: `${PREFIX}-user-info`,
  circle: `${PREFIX}-circle`,
  button: `${PREFIX}-button`
};

interface CommentsProps {
  course: SCCourseType | null;
}

function CommentsSkeleton() {
  return (
    <Box className={classes.container}>
      <Skeleton animation="wave" variant="text" width="90px" height="21px" />

      {Array.from(new Array(2)).map((_, i) => (
        <Box key={i} className={classes.outerWrapper}>
          <Skeleton animation="wave" variant="text" width="90px" height="21px" />
          <Divider />
          <Stack className={classes.innerWrapper}>
            {Array.from(new Array(4)).map((_, j) => (
              <Stack key={j} className={classes.userWrapper}>
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
      ))}

      <Skeleton animation="wave" variant="rounded" width="88px" height="36px" />
    </Box>
  );
}

export default function Comments(props: CommentsProps) {
  // PROPS
  const {course} = props;

  // STATES
  const [comments, setComments] = useState<CommentsType | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    if (course) {
      getCommentsData(course.id)
        .then((commentsData) => {
          if (commentsData) {
            setComments(commentsData);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    }
  }, [course]);

  // HANDLERS
  const handleSeeMore = useCallback(() => {
    setIsLoadingComments(true);

    getOtherCommentsData(course.id)
      .then((commentsData) => {
        if (commentsData) {
          setComments((prevComments) => ({
            ...prevComments,
            next: commentsData.next,
            lessons: [...prevComments.lessons, ...commentsData.lessons]
          }));
          setIsLoadingComments(false);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [setIsLoadingComments, setComments, course]);

  if (!comments) {
    return <CommentsSkeleton />;
  }

  return (
    <Box className={classes.container}>
      <Typography variant="body1">
        <FormattedMessage
          id="ui.course.dashboard.teacher.tab.comments.number"
          defaultMessage="ui.course.dashboard.teacher.tab.comments.number"
          values={{commentsNumber: comments.total}}
        />
      </Typography>

      {comments?.lessons.map((lesson) => (
        <Box key={lesson.id} className={classes.outerWrapper}>
          <Typography variant="h5">{lesson.name}</Typography>
          <Divider />
          <Stack className={classes.innerWrapper}>
            {lesson.users.map((user) => (
              <Stack key={user.id} className={classes.userWrapper}>
                <Avatar src={user.avatar} alt={user.name} className={classes.avatar} />

                <Box>
                  <Stack className={classes.userInfo}>
                    <Typography variant="body1">{user.name}</Typography>

                    <Box className={classes.circle} />

                    <Typography variant="body2">{user.date}</Typography>
                  </Stack>

                  <Typography variant="body1">{user.comment}</Typography>
                </Box>
              </Stack>
            ))}

            <Button size="small" variant="outlined" color="inherit" onClick={() => console.log(lesson.id)} className={classes.button}>
              <Typography variant="body2">
                <FormattedMessage
                  id="ui.course.dashboard.teacher.tab.comments.lessons.btn.label"
                  defaultMessage="ui.course.dashboard.teacher.tab.comments.lessons.btn.label"
                />
              </Typography>
            </Button>
          </Stack>
        </Box>
      ))}

      <LoadingButton size="small" variant="outlined" color="inherit" loading={isLoadingComments} disabled={!comments.next} onClick={handleSeeMore}>
        <Typography variant="body2">
          <FormattedMessage
            id="ui.course.dashboard.teacher.tab.comments.btn.label"
            defaultMessage="ui.course.dashboard.teacher.tab.comments.btn.label"
          />
        </Typography>
      </LoadingButton>
    </Box>
  );
}
