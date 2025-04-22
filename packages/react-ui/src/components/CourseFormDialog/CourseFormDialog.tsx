import {styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {PREFIX} from './constants';
import CourseForm, {CourseFormProps} from '../CourseForm';
import {useCallback, useState} from 'react';
import {SCCourseFormStepType} from '../../constants/Course';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CourseFormDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Open dialog
   * @default true
   */
  open?: boolean;

  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;

  /**
   * Props to spread to CourseForm component
   * @default {}
   */
  CourseFormComponentProps?: CourseFormProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS CourseFormDialog component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CourseFormDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCourseFormDialog` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourseFormDialog-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CourseFormDialog(inProps: CourseFormDialogProps): JSX.Element {
  //PROPS
  const props: CourseFormDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, CourseFormComponentProps = {}, ...rest} = props;
  // STATE
  const [step, setStep] = useState(SCCourseFormStepType.GENERAL);
  const [type, setType] = useState('');

  //HANDLERS

  const handleStepTypeChange = (step: SCCourseFormStepType, type) => {
    setStep(step);
    setType(type);
  };

  const handleSuccess = useCallback(
    (course: SCCourseType) => {
      CourseFormComponentProps.onSuccess?.(course);
      onClose?.();
    },
    [onClose, CourseFormComponentProps]
  );

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      title={
        CourseFormComponentProps?.course ? (
          <FormattedMessage id="ui.courseForm.title.edit" defaultMessage="ui.courseForm.title.edit" />
        ) : step === SCCourseFormStepType.GENERAL ? (
          <FormattedMessage id="ui.courseForm.title.general" defaultMessage="ui.courseForm.title.general" />
        ) : (
          <FormattedMessage
            id="ui.courseForm.title.customization"
            defaultMessage="ui.courseForm.title.customization"
            values={{
              courseType: <FormattedMessage id={`ui.courseForm.${type}.title`} defaultMessage={`ui.courseForm.${type}.title`} />
            }}
          />
        )
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <CourseForm {...CourseFormComponentProps} onStepChange={handleStepTypeChange} onSuccess={handleSuccess} />
    </Root>
  );
}
