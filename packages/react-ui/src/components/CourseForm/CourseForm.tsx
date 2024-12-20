import {LoadingButton} from '@mui/lab';
import {Box, BoxProps, CardActionArea, Card, CardContent, FormGroup, Paper, TextField, Typography, Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {CourseService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCCourseType, SCCourseTypologyType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {ChangeEvent, useCallback, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {PREFIX} from './constants';
import UploadCourseCover from './UploadCourseCover';
import {COURSE_DESCRIPTION_MAX_LENGTH, COURSE_TITLE_MAX_LENGTH} from '../../constants/Course';
import CategoryAutocomplete from '../CategoryAutocomplete';
import CourseEdit from './Edit';

const messages = defineMessages({
  name: {
    id: 'ui.courseForm.name.placeholder',
    defaultMessage: 'ui.courseForm.name.placeholder'
  },
  description: {
    id: 'ui.courseForm.description.placeholder',
    defaultMessage: 'ui.courseForm.description.placeholder'
  },
  category: {
    id: 'ui.courseForm.category.placeholder',
    defaultMessage: 'ui.courseForm.category.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  card: `${PREFIX}-card`,
  selected: `${PREFIX}-selected`,
  cover: `${PREFIX}-cover`,
  frequency: `${PREFIX}-frequency`,
  form: `${PREFIX}-form`,
  name: `${PREFIX}-name`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  stepOne: `${PREFIX}-step-one`,
  stepTwo: `${PREFIX}-step-two`,
  privacySection: `${PREFIX}-privacy-section`,
  privacySectionInfo: `${PREFIX}-privacy-section-info`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export enum SCCourseFormStepType {
  ONE = 'one',
  TWO = 'two'
}

export interface CourseFormProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Course Object
   * @default null
   */
  course?: SCCourseType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCCourseType) => void;

  /**
   * step name
   * @default 'one'
   */
  step: SCCourseFormStepType;

  /**
   * On error callback function
   * @default null
   */
  onError?: (error: any) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS  Course Form component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CourseForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCourseForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourseForm-root|Styles applied to the root element.|
 |title|.SCCourseForm-title|Styles applied to the title element.|
 |cover|.SCCourseForm-cover|Styles applied to the cover field.|
 |form|.SCCourseForm-form|Styles applied to the form element.|
 |name|.SCCourseForm-name|Styles applied to the name field.|
 |description|.SCCourseForm-description|Styles applied to the description field.|
 |content|.SCCourseForm-content|Styles applied to the  element.|
 |error|.SCCourseForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function CourseForm(inProps: CourseFormProps): JSX.Element {
  //PROPS
  const props: CourseFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, onError, course = null, courseId, step = SCCourseFormStepType.ONE, ...rest} = props;

  // INTL
  const intl = useIntl();

  const initialFieldState: any = {
    imageOriginal: course?.image_bigger || '',
    imageOriginalFile: '',
    name: course?.name || '',
    type: course?.type || '',
    description: course ? course.description : '',
    category: course ? course.category : null,
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState(initialFieldState);
  const [_step, setStep] = useState<SCCourseFormStepType>(step);
  const [error, setError] = useState<any>({});

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  const _backgroundCover = {
    ...(field.imageOriginal
      ? {background: `url('${field.imageOriginal}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  const handleChangeCover = useCallback(
    (cover: Blob) => {
      setField((prev) => ({...prev, ['imageOriginalFile']: cover}));

      const reader = new FileReader();

      reader.onloadend = () => {
        setField((prev) => ({...prev, ['imageOriginal']: reader.result}));
      };

      reader.readAsDataURL(cover);

      if (error.imageOriginalError) {
        delete error.imageOriginalError;

        setError(error);
      }
    },
    [error]
  );

  const handleChangeStep = (newStep: SCCourseFormStepType) => {
    setStep(newStep);
  };

  /**
   * Notify when a group info changed
   * @param data
   */
  const notifyChanges = useCallback(
    (data: SCCourseType) => {
      if (course) {
        // Edit group
        PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.EDIT}`, data);
      } else {
        // Create group
        PubSub.publish(`${SCTopicType.COURSE}.${SCCourseEventType.CREATE}`, data);
      }
    },
    [course]
  );

  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, ['isSubmitting']: true}));
    const formData = new FormData();
    if (field.imageOriginalFile) {
      formData.append('image_original', field.imageOriginalFile);
    }
    formData.append('name', field.name);
    formData.append('description', field.description);

    let eventService: Promise<SCCourseType>;
    if (course) {
      eventService = CourseService.updateCourse(course.id, formData as unknown as SCCourseType, {headers: {'Content-Type': 'multipart/form-data'}});
    } else {
      eventService = CourseService.createCourse(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    eventService
      .then((data) => {
        notifyChanges(data);
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        onSuccess?.(data);
      })
      .catch((e) => {
        const _error = formatHttpErrorCode(e);

        if (Object.values(_error)[0]['error'] === 'unique') {
          setError({
            ...error,
            ['nameError']: <FormattedMessage id="ui.courseForm.name.error.unique" defaultMessage="ui.courseForm.name.error.unique" />
          });
        } else {
          setError({...error, ..._error});
        }

        setField((prev) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
        onError?.(e);
      });
  }, [field, onSuccess, onError, notifyChanges]);

  const handleChange = useCallback(
    (course: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = course.target;
      setField((prev) => ({...prev, [name]: value}));

      if (error[`${name}Error`]) {
        delete error[`${name}Error`];

        setError(error);
      }
    },
    [setField, error]
  );

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={_step === SCCourseFormStepType.ONE ? classes.stepOne : classes.stepTwo}>
        {_step === SCCourseFormStepType.ONE && (
          <>
            {Object.values(SCCourseTypologyType).map((option, index) => (
              <Card className={classNames(classes.card, {[classes.selected]: option === field.type})} key={index}>
                <CardActionArea onClick={() => setField((prev) => ({...prev, ['type']: option}))}>
                  <CardContent>
                    <Typography variant="subtitle2">
                      <FormattedMessage id={`ui.courseForm.${option}.title`} defaultMessage={`ui.courseForm.${option}.title`} />
                    </Typography>
                    <Typography variant="body2">
                      <FormattedMessage id={`ui.courseForm.${option}.info`} defaultMessage={`ui.courseForm.${option}.info`} />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </>
        )}
        {_step === SCCourseFormStepType.TWO && (
          <FormGroup className={classes.form}>
            {course && (
              <Typography variant="h5">
                <FormattedMessage id="ui.courseForm.edit.title.general" defaultMessage="ui.courseForm.edit.title.general" />
              </Typography>
            )}
            <Paper style={_backgroundCover} classes={{root: classes.cover}}>
              <UploadCourseCover isCreationMode={true} onChange={handleChangeCover} />
            </Paper>
            <TextField
              required
              className={classes.name}
              placeholder={`${intl.formatMessage(messages.name)}`}
              margin="normal"
              value={field.name}
              name="name"
              onChange={handleChange}
              InputProps={{
                endAdornment: <Typography variant="body2">{COURSE_TITLE_MAX_LENGTH - field.name.length}</Typography>
              }}
              error={Boolean(field.name.length > COURSE_TITLE_MAX_LENGTH) || Boolean(error['nameError'])}
              helperText={
                field.name.length > COURSE_TITLE_MAX_LENGTH ? (
                  <FormattedMessage id="ui.courseForm.name.error.maxLength" defaultMessage="ui.courseForm.name.error.maxLength" />
                ) : error['nameError'] ? (
                  error['nameError']
                ) : null
              }
            />
            <TextField
              multiline
              className={classes.description}
              placeholder={`${intl.formatMessage(messages.description)}`}
              margin="normal"
              value={field.description}
              name="description"
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <Typography variant="body2">
                    {field.description?.length ? COURSE_DESCRIPTION_MAX_LENGTH - field.description.length : COURSE_DESCRIPTION_MAX_LENGTH}
                  </Typography>
                )
              }}
              error={Boolean(field.description?.length > COURSE_DESCRIPTION_MAX_LENGTH)}
              helperText={
                field.description?.length > COURSE_DESCRIPTION_MAX_LENGTH ? (
                  <FormattedMessage id="ui.courseForm.description.error.maxLength" defaultMessage="ui.courseForm.description.error.maxLength" />
                ) : null
              }
            />
            <CategoryAutocomplete TextFieldProps={{label: `${intl.formatMessage(messages.category)}`}} />
            {course && <CourseEdit course={course} />}
          </FormGroup>
        )}
        <Box className={classes.actions}>
          {course && (
            <Button size="small" variant="outlined">
              <FormattedMessage id="ui.courseForm.edit.action.cancel" defaultMessage="ui.courseForm.edit.action.cancel" />
            </Button>
          )}
          <LoadingButton
            size="small"
            loading={field.isSubmitting}
            disabled={
              _step === SCCourseFormStepType.ONE
                ? !field.type || Object.keys(error).length !== 0
                : _step === SCCourseFormStepType.TWO &&
                  (!field.name ||
                    Object.keys(error).length !== 0 ||
                    field.name.length > COURSE_TITLE_MAX_LENGTH ||
                    field.description.length > COURSE_DESCRIPTION_MAX_LENGTH)
            }
            variant="contained"
            onClick={_step === SCCourseFormStepType.ONE ? () => handleChangeStep(SCCourseFormStepType.TWO) : handleSubmit}
            color="secondary">
            {course ? (
              <FormattedMessage id="ui.courseForm.edit.action.save" defaultMessage="ui.courseForm.edit.action.save" />
            ) : _step === SCCourseFormStepType.ONE ? (
              <FormattedMessage id="ui.courseForm.button.next" defaultMessage="ui.courseForm.button.next" />
            ) : (
              <FormattedMessage id="ui.courseForm.button.create" defaultMessage="ui.courseForm.button.create" />
            )}
          </LoadingButton>
        </Box>
      </Box>
    </Root>
  );
}
