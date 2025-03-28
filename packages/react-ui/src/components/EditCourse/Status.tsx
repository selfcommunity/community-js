import {Button, Chip, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';
import {SyntheticEvent, useCallback} from 'react';
import {SCCourseEditTabType} from '../../types';

const classes = {
  status: `${PREFIX}-status`,
  contrastColor: `${PREFIX}-contrast-color`
};

interface StatusProps {
  course: SCCourseType;
  handleTabChange: (_e: SyntheticEvent, newTabValue: SCCourseEditTabType) => void;
}

export default function Status(props: StatusProps) {
  // STATES
  const {course, handleTabChange} = props;

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleClick = useCallback(() => {
    handleTabChange(null, SCCourseEditTabType.CUSTOMIZE);
  }, [handleTabChange]);

  return (
    <Chip
      label={
        <Button size="small" variant="text" color="inherit" onClick={handleClick}>
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
        </Button>
      }
      className={classNames(classes.status, classes.contrastColor)}
    />
  );
}
