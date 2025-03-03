import {Box, Button, Icon, Stack, Typography} from '@mui/material';
import {SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {memo, useMemo} from 'react';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCCourseEditTabType} from '../../types';

const classes = {
  header: `${PREFIX}-header`,
  img: `${PREFIX}-header-img`,
  outerWrapper: `${PREFIX}-header-outer-wrapper`,
  innerWrapper: `${PREFIX}-header-inner-wrapper`,
  iconWrapper: `${PREFIX}-header-icon-wrapper`
};

type DataUrlEditDashboard = {
  id: number;
  slug: string;
  tab: SCCourseEditTabType;
};

function getUrlEditDashboard(course: SCCourseType): DataUrlEditDashboard {
  return {
    id: course.id,
    slug: course.slug,
    tab: SCCourseEditTabType.LESSONS
  };
}

interface HeaderCourseDashboardProps {
  course: SCCourseType;
  hasAction?: boolean;
}

function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, hasAction = false} = props;

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();

  const iconData = useMemo(() => {
    const underId = course.privacy === SCCoursePrivacyType.DRAFT ? 'draft' : course.privacy;

    return [
      {
        id: 'ui.course.label',
        icon: 'public',
        key: 'privacy',
        underId: `ui.course.privacy.${underId}`
      },
      {
        id: 'ui.course.type',
        icon: 'courses',
        key: 'typeOfCourse',
        underId: `ui.course.type.${course.type}`
      }
    ];
  }, [course]);

  return (
    <Box className={classes.header}>
      <img src={course.image_bigger} alt={course.image_bigger} className={classes.img} />

      <Typography variant="h3">{course.name}</Typography>

      <Stack className={classes.outerWrapper}>
        <Stack className={classes.innerWrapper}>
          {iconData.map((data, i) => (
            <Stack key={i} className={classes.iconWrapper}>
              <Icon fontSize="small">{data.icon}</Icon>

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
            </Stack>
          ))}
        </Stack>

        {hasAction && (
          <Button
            component={Link}
            to={scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, getUrlEditDashboard(course))}
            size="small"
            color="primary"
            variant="contained">
            <Typography variant="body2">
              <FormattedMessage id="ui.course.dashboard.teacher.btn.label" defaultMessage="ui.course.dashboard.teacher.btn.label" />
            </Typography>
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default memo(HeaderCourseDashboard);
