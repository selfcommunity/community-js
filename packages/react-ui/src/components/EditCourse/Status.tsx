import {Chip, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {LESSONS_DATA} from './data';

const classes = {
  status: `${PREFIX}-status`
};

export default function Status() {
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
                id: `ui.course.status.${LESSONS_DATA.statusCourse}`,
                defaultMessage: `ui.course.status.${LESSONS_DATA.statusCourse}`
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
      className={classes.status}
    />
  );
}
