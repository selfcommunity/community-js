import {Chip, Skeleton, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';

const classes = {
  status: `${PREFIX}-status`
};

interface StatusProps {
  course: SCCourseType | null;
}

export default function Status(props: StatusProps) {
  // STATES
  const {course} = props;

  // HOOKS
  const intl = useIntl();

  return (
    <Chip
      label={
        course ? (
          <Typography variant="body1">
            {intl.formatMessage(
              {id: 'ui.editCourse.tab.lessons.status', defaultMessage: 'ui.editCourse.tab.lessons.status'},
              {
                status: intl.formatMessage({
                  id: `ui.course.privacy.${course.privacy === '' ? SCCoursePrivacyType.DRAFT : course.privacy}`,
                  defaultMessage: `ui.course.privacy.${course.privacy === '' ? SCCoursePrivacyType.DRAFT : course.privacy}`
                }),
                b: (chunks) => (
                  <Typography component="b" fontWeight="bold">
                    {chunks}
                  </Typography>
                )
              }
            )}
          </Typography>
        ) : (
          <Skeleton animation="wave" variant="text" width="70px" height="21px" />
        )
      }
      className={classes.status}
    />
  );
}
