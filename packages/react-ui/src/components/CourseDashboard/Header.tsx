import {Box, Button, Icon, Skeleton, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {memo, useMemo} from 'react';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';

const classes = {
  header: `${PREFIX}-header`,
  img: `${PREFIX}-header-img`,
  outerWrapper: `${PREFIX}-header-outer-wrapper`,
  innerWrapper: `${PREFIX}-header-inner-wrapper`,
  iconWrapper: `${PREFIX}-header-icon-wrapper`
};

interface HeaderCourseDashboardProps {
  course: SCCourseType | null;
  hasAction?: boolean;
}

function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, hasAction = false} = props;

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();

  // MEMOS
  const button = useMemo(() => {
    if (!course && hasAction) {
      return <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />;
    } else if (hasAction) {
      return (
        <Button component={Link} to={scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, course)} size="small" color="primary" variant="contained">
          <Typography variant="body2">
            <FormattedMessage id="ui.course.dashboard.teacher.btn.label" defaultMessage="ui.course.dashboard.teacher.btn.label" />
          </Typography>
        </Button>
      );
    }
  }, [course, hasAction]);

  const iconData = useMemo(() => {
    return [
      {
        id: 'ui.course.label',
        icon: 'public',
        key: 'privacy',
        underId: `ui.course.privacy.${course?.privacy}`
      },
      {
        id: 'ui.course.type',
        icon: 'courses',
        key: 'typeOfCourse',
        underId: `ui.course.type.${course?.type}`
      }
    ];
  }, [course]);

  return (
    <Box className={classes.header}>
      {course ? (
        <img src={course.image_big} alt={course.image_big} className={classes.img} />
      ) : (
        <Skeleton animation="wave" variant="rectangular" className={classes.img} />
      )}

      {course ? <Typography variant="h3">{course.name}</Typography> : <Skeleton animation="wave" variant="text" width="266px" height="25px" />}

      <Stack className={classes.outerWrapper}>
        <Stack className={classes.innerWrapper}>
          {iconData.map((data, i) => (
            <Stack key={i} className={classes.iconWrapper}>
              <Icon fontSize="small">{data.icon}</Icon>

              {course ? (
                <Typography variant="body2">
                  <FormattedMessage
                    id={data.id}
                    defaultMessage={data.id}
                    values={{
                      [`${data.key}`]: intl.formatMessage({
                        id: data.underId,
                        defaultMessage: data.underId
                      })
                    }}
                  />
                </Typography>
              ) : (
                <Skeleton animation="wave" variant="text" width="50px" height="21px" />
              )}
            </Stack>
          ))}
        </Stack>

        {button}
      </Stack>
    </Box>
  );
}

export default memo(HeaderCourseDashboard);
