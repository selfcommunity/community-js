import {Box, Button, Icon, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {LESSONS_DATA} from '../EditCourse/data';
import {PREFIX} from './constants';

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
  course: SCCourseType;
  handleAction?: () => void;
}

export default function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, handleAction} = props;

  // HOOKS
  const intl = useIntl();

  return (
    <Box className={classes.header}>
      <img src={course.image_big} alt={course.image_big} className={classes.img} />

      <Typography variant="h3">{course.name}</Typography>

      <Stack className={classes.outerWrapper}>
        <Stack className={classes.innerWrapper}>
          {ICON_DATA.map((data, i) => (
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

        {handleAction && (
          <Button size="small" color="primary" variant="contained" onClick={handleAction}>
            <Typography variant="body2">
              <FormattedMessage id="ui.course.dashboard.teacher.btnLabel" defaultMessage="ui.course.dashboard.teacher.btnLabel" />
            </Typography>
          </Button>
        )}
      </Stack>
    </Box>
  );
}
