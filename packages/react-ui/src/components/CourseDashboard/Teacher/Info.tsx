import {Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import CourseParticipantsButton from '../../CourseParticipantsButton';

const classes = {
  info: `${PREFIX}-info`
};

interface InfoCourseDashboardProps {
  title: string;
  course: SCCourseType;
  position: 'first' | 'second';
}

export default function InfoCourseDashboard(props: InfoCourseDashboardProps) {
  // PROPS
  const {title, course, position} = props;

  return (
    <Stack className={classes.info}>
      <Typography variant="h4">
        <FormattedMessage id={title} defaultMessage={title} />
      </Typography>

      {position === 'first' && <CourseParticipantsButton course={course} />}
      {position === 'second' && <Typography variant="h5">{course['avg_completion']} 76%</Typography>}
    </Stack>
  );
}
