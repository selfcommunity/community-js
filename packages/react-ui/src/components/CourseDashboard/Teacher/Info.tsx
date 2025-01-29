import {Skeleton, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import CourseParticipantsButton from '../../CourseParticipantsButton';
import {useMemo} from 'react';

const classes = {
  info: `${PREFIX}-info`
};

interface InfoCourseDashboardProps {
  title: string;
  course: SCCourseType | null;
  position: 'first' | 'second';
}

export default function InfoCourseDashboard(props: InfoCourseDashboardProps) {
  // PROPS
  const {title, course, position} = props;

  // MEMOS
  const children = useMemo(() => {
    if (!course) {
      return <Skeleton animation="wave" variant="text" width="100" height="21px" />;
    }

    switch (position) {
      case 'first':
        return <CourseParticipantsButton course={course} />;
      case 'second':
        return <Typography variant="h5">{course.avg_completion_rate}%</Typography>;
    }
  }, [course, position]);

  return (
    <Stack className={classes.info}>
      <Typography variant="h4">
        <FormattedMessage id={title} defaultMessage={title} />
      </Typography>

      {children}
    </Stack>
  );
}
