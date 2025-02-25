import {SCCourseType} from '@selfcommunity/types';
import CourseForm from '../CourseForm';
import {memo, useCallback} from 'react';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import Skeleton from '../CourseForm/Skeleton';
import {SCCourseFormStepType} from '../../constants/Course';

interface CustomizeProps {
  course: SCCourseType | null;
  setSCCourse: (course: SCCourseType) => void;
}

function Customize(props: CustomizeProps) {
  // PROPS
  const {course, setSCCourse} = props;

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleSuccess = useCallback(
    (data: SCCourseType) => {
      setSCCourse(data);

      enqueueSnackbar(
        <FormattedMessage id="ui.editCourse.tab.customize.snackbar.save" defaultMessage="ui.editCourse.tab.customize.snackbar.save" />,
        {
          variant: 'success',
          autoHideDuration: 3000
        }
      );
    },
    [setSCCourse]
  );

  const handleError = useCallback(() => {
    enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
      variant: 'error',
      autoHideDuration: 3000
    });
  }, []);

  if (!course) {
    return <Skeleton />;
  }

  return <CourseForm course={course} step={SCCourseFormStepType.CUSTOMIZATION} onSuccess={handleSuccess} onError={handleError} />;
}

export default memo(Customize);
