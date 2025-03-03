import {Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import CourseParticipantsButton from '../../CourseParticipantsButton';
import {memo} from 'react';
import {InfoPositionType} from '../types';

const classes = {
  info: `${PREFIX}-info`
};

interface InfoCourseDashboardProps {
  title: string;
  course: SCCourseType;
  position: InfoPositionType;
}

function InfoCourseDashboard(props: InfoCourseDashboardProps) {
  // PROPS
  const {title, course, position} = props;

  return (
    <Stack className={classes.info}>
      <Typography variant="h4">
        <FormattedMessage id={title} defaultMessage={title} />
      </Typography>

      {position === InfoPositionType.FIRST && <CourseParticipantsButton course={course} />}
      {position === InfoPositionType.SECOND && <Typography variant="h5">{course.avg_completion_rate}%</Typography>}
    </Stack>
  );
}

export default memo(InfoCourseDashboard);
