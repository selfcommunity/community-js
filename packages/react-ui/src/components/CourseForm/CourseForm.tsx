import {LoadingButton} from '@mui/lab';
import {Box, BoxProps, CardActionArea, Card, CardContent, FormGroup, Paper, TextField, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {CourseService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCCategoryType, SCCoursePrivacyType, SCCourseType, SCCourseTypologyType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {ChangeEvent, Fragment, useCallback, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import {PREFIX} from './constants';
import UploadCourseCover from './UploadCourseCover';
import {COURSE_DESCRIPTION_MAX_LENGTH, COURSE_TITLE_MAX_LENGTH, SCCourseFormStepType} from '../../constants/Course';
import CategoryAutocomplete from '../CategoryAutocomplete';
import CourseEdit from './Edit';
import CoursePublicationDialog from './Dialog';

const messages = defineMessages({
  name: {
    id: 'ui.courseForm.name.placeholder',
    defaultMessage: 'ui.courseForm.name.placeholder'
  },
  description: {
    id: 'ui.courseForm.description.placeholder',
    defaultMessage: 'ui.courseForm.description.placeholder'
  },
  categoryEmpty: {
    id: 'ui.courseForm.category.placeholder.empty',
    defaultMessage: 'ui.courseForm.category.placeholder.empty'
  },
  category: {
    id: 'ui.courseForm.category.placeholder',
    defaultMessage: 'ui.courseForm.category.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  actions: `${PREFIX}-actions`,
  card: `${PREFIX}-card`,
  content: `${PREFIX}-content`,
  cover: `${PREFIX}-cover`,
  description: `${PREFIX}-description`,
  error: `${PREFIX}-error`,
  form: `${PREFIX}-form`,
  frequency: `${PREFIX}-frequency`,
  name: `${PREFIX}-name`,
  privacySection: `${PREFIX}-privacy-section`,
  privacySectionInfo: `${PREFIX}-privacy-section-info`,
  selected: `${PREFIX}-selected`,
  stepOne: `${PREFIX}-step-one`,
  stepTwo: `${PREFIX}-step-two`,
  title: `${PREFIX}-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
   * @default `SCCourseFormStepType.GENERAL`
   */
  step?: SCCourseFormStepType;

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
 | root                  | .SCCourseForm-root            | Styles applied to the root element.            |
 | actions               | .SCCourseForm-actions         | Styles applied to the actions element.         |
 | card                  | .SCCourseForm-card            | Styles applied to the card element.            |
 | content               | .SCCourseForm-content         | Styles applied to the content element.         |
 | cover                 | .SCCourseForm-cover           | Styles applied to the cover element.           |
 | description           | .SCCourseForm-description     | Styles applied to the description element.     |
 | error                 | .SCCourseForm-error           | Styles applied to the error element.           |
 | form                  | .SCCourseForm-form            | Styles applied to the form element.            |
 | frequency             | .SCCourseForm-frequency       | Styles applied to the frequency element.       |
 | name                  | .SCCourseForm-name            | Styles applied to the name element.            |
 | privacySection        | .SCCourseForm-privacy-section | Styles applied to the privacy section.         |
 | privacySectionInfo    | .SCCourseForm-privacy-section-info | Styles applied to the privacy section info. |
 | selected              | .SCCourseForm-selected        | Styles applied to the selected element.        |
 | stepOne               | .SCCourseForm-step-one        | Styles applied to the step-one element.        |
 | stepTwo               | .SCCourseForm-step-two        | Styles applied to the step-two element.        |
 | title                 | .SCCourseForm-title           | Styles applied to the title element.           |

 * @param inProps
 */
export default function CourseForm(inProps: CourseFormProps): JSX.Element {
  //PROPS
  const props: CourseFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, onError, course = null, step = SCCourseFormStepType.GENERAL, ...rest} = props;

  // INTL
  const intl = useIntl();

  const initialFieldState: any = {
    imageOriginal: course?.image_bigger || '',
    imageOriginalFile: '',
    name: course?.name || '',
    type: course?.type || '',
    description: course ? course.description : '',
    categories: course ? course.categories : [],
    privacy: course ? course.privacy : '',
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState(initialFieldState);
  const [_step, setStep] = useState<SCCourseFormStepType>(step);
  const [error, setError] = useState<any>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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

  /**
   * Handles step change
   * @param newStep
   */
  const handleChangeStep = (newStep: SCCourseFormStepType) => {
    setStep(newStep);
  };

  /**
   * Formats categories object to a specific format needed in the form body
   * @param data
   */
  function convertToCategoriesObject(data) {
    const categories = {};
    data.forEach((category, index) => {
      categories[`categories[${index}]`] = category.id;
    });
    return categories;
  }

  /**
   * Handle change category
   * @param categories
   */
  const handleOnChangeCategory = (categories: SCCategoryType[]) => {
    const categoriesIds = categories.map((item) => item.id);
    setField((prev: any) => ({...prev, ['categories']: course ? categoriesIds : convertToCategoriesObject(categories)}));
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

  /**
   * Handles the form submission for create/update action
   */
  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, isSubmitting: true}));
    let courseService: Promise<SCCourseType>;
    if (course) {
      // Update
      const data: any = {
        name: field.name,
        description: field.description,
        type: field.type,
        categories: field.categories,
        ...(field.privacy && {privacy: field.privacy})
      };
      courseService = CourseService.updateCourse(course.id, data, {
        headers: {'Content-Type': 'application/json'}
      });
    } else {
      // Create
      const formData = new FormData();
      if (field.imageOriginalFile) {
        formData.append('image_original', field.imageOriginalFile);
      }
      formData.append('name', field.name);
      formData.append('description', field.description);
      formData.append('type', field.type);
      if (field.categories) {
        for (const key in field.categories) {
          formData.append(key, field.categories[key]);
        }
      }
      courseService = CourseService.createCourse(formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
    }
    courseService
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
  }, [course, field, onSuccess, onError, notifyChanges]);

  /**
   * Handles course fields change
   */
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
   * Handles for closing confirm dialog
   */
  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, [setOpenDialog]);

  /**
   * Renders root object
   */
  return (
    <Fragment>
      <Root className={classNames(classes.root, className)} {...rest}>
        <Box className={_step === SCCourseFormStepType.GENERAL ? classes.stepOne : classes.stepTwo}>
          {_step === SCCourseFormStepType.GENERAL && (
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
          {_step === SCCourseFormStepType.CUSTOMIZATION && (
            <FormGroup className={classes.form}>
              {course && (
                <Typography variant="h5">
                  <FormattedMessage id="ui.courseForm.edit.title.general" defaultMessage="ui.courseForm.edit.title.general" />
                </Typography>
              )}
              <Paper style={_backgroundCover} classes={{root: classes.cover}}>
                <UploadCourseCover courseId={course?.id ?? null} isCreationMode={!course} onChange={handleChangeCover} />
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
              <CategoryAutocomplete
                defaultValue={field.categories}
                TextFieldProps={{label: intl.formatMessage(Object.keys(field.categories).length ? messages.category : messages.categoryEmpty)}}
                multiple={true}
                onChange={handleOnChangeCategory}
              />
              {course && <CourseEdit course={course} onPrivacyChange={(privacy) => setField((prev) => ({...prev, ['privacy']: privacy}))} />}
            </FormGroup>
          )}
          <Box className={classes.actions}>
            <LoadingButton
              size="small"
              loading={field.isSubmitting}
              disabled={
                _step === SCCourseFormStepType.GENERAL
                  ? !field.type || Object.keys(error).length !== 0
                  : _step === SCCourseFormStepType.CUSTOMIZATION &&
                    (!field.name ||
                      Object.keys(error).length !== 0 ||
                      field.name.length > COURSE_TITLE_MAX_LENGTH ||
                      field.description.length > COURSE_DESCRIPTION_MAX_LENGTH ||
                      (!!field.privacy && (!field.description || course.num_sections === 0 || course.num_lessons === 0)))
              }
              variant="contained"
              onClick={
                _step === SCCourseFormStepType.GENERAL
                  ? () => handleChangeStep(SCCourseFormStepType.CUSTOMIZATION)
                  : field.privacy !== SCCoursePrivacyType.DRAFT && course.privacy === SCCoursePrivacyType.DRAFT
                  ? () => setOpenDialog(true)
                  : handleSubmit
              }
              color="primary">
              {course ? (
                <FormattedMessage id="ui.courseForm.edit.action.save" defaultMessage="ui.courseForm.edit.action.save" />
              ) : _step === SCCourseFormStepType.GENERAL ? (
                <FormattedMessage id="ui.courseForm.button.next" defaultMessage="ui.courseForm.button.next" />
              ) : (
                <FormattedMessage id="ui.courseForm.button.create" defaultMessage="ui.courseForm.button.create" />
              )}
            </LoadingButton>
          </Box>
        </Box>
      </Root>

      {openDialog && <CoursePublicationDialog onSubmit={handleSubmit} onClose={handleClose} />}
    </Fragment>
  );
}
