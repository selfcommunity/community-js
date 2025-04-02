import {SCCourseType} from '@selfcommunity/types';
import CourseForm from '../CourseForm';
import {memo, useCallback} from 'react';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import {SCCourseFormStepType} from '../../constants/Course';

interface CustomizeProps {
  course: SCCourseType;
  setCourse: (course: SCCourseType) => void;
}

function Customize(props: CustomizeProps) {
  // PROPS
  const {course, setCourse} = props;

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleSuccess = useCallback(
    (data: SCCourseType) => {
      setCourse({...course, ...data});

      enqueueSnackbar(
        <FormattedMessage id="ui.editCourse.tab.customize.snackbar.save" defaultMessage="ui.editCourse.tab.customize.snackbar.save" />,
        {
          variant: 'success',
          autoHideDuration: 3000
        }
      );
    },
    [course]
  );

  const handleError = useCallback(() => {
    enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
      variant: 'error',
      autoHideDuration: 3000
    });
  }, []);

  return <CourseForm course={course} step={SCCourseFormStepType.CUSTOMIZATION} onSuccess={handleSuccess} onError={handleError} />;
}

export default memo(Customize);
