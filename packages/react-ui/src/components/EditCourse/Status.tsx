import {Chip, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';

const classes = {
  status: `${PREFIX}-status`,
  contrastBgColor: `${PREFIX}-contrast-bg-color`
};

interface StatusProps {
  course: SCCourseType;
}

export default function Status(props: StatusProps) {
  // STATES
  const {course} = props;

  // HOOKS
  const intl = useIntl();

  return (
    <Chip
      label={
        <Typography variant="body1">
          {intl.formatMessage(
            {id: 'ui.editCourse.tab.lessons.status', defaultMessage: 'ui.editCourse.tab.lessons.status'},
            {
              status: intl.formatMessage({
                id: `ui.course.privacy.${course.privacy === SCCoursePrivacyType.DRAFT ? 'draft' : course.privacy}`,
                defaultMessage: `ui.course.privacy.${course.privacy === SCCoursePrivacyType.DRAFT ? 'draft' : course.privacy}`
              }),
              b: (chunks) => (
                <Typography component="b" fontWeight="bold">
                  {chunks}
                </Typography>
              )
            }
          )}
        </Typography>
      }
      className={classNames(classes.status, classes.contrastBgColor)}
    />
  );
}
