import {Box, Button, Icon, Skeleton, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {LESSONS_DATA} from '../EditCourse/data';
import {PREFIX} from './constants';
import {useMemo} from 'react';

const classes = {
  header: `${PREFIX}-header`,
  img: `${PREFIX}-header-img`,
  outerWrapper: `${PREFIX}-header-outer-wrapper`,
  innerWrapper: `${PREFIX}-header-inner-wrapper`,
  iconWrapper: `${PREFIX}-header-icon-wrapper`
};

const ICON_DATA = [
  {
    id: 'ui.course.label',
    icon: 'public',
    key: 'privacy',
    underId: `ui.course.privacy.${LESSONS_DATA.privacy}`
  },
  {
    id: 'ui.course.type',
    icon: 'courses',
    key: 'typeOfCourse',
    underId: `ui.course.type.${LESSONS_DATA.typeOfCourse}`
  }
];

interface HeaderCourseDashboardProps {
  course: SCCourseType | null;
  handleAction?: () => void;
}

export default function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, handleAction} = props;

  // HOOKS
  const intl = useIntl();

  // MEMOS
  const button = useMemo(() => {
    if (!course) {
      return <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />;
    }

    if (handleAction) {
      return (
        <Button size="small" color="primary" variant="contained" onClick={handleAction}>
          <Typography variant="body2">
            <FormattedMessage id="ui.course.dashboard.teacher.btnLabel" defaultMessage="ui.course.dashboard.teacher.btnLabel" />
          </Typography>
        </Button>
      );
    }
  }, [course, handleAction]);

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
          {ICON_DATA.map((data, i) => (
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
