import {LoadingButton} from '@mui/lab';
import {
  Box,
  BoxProps,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {LocalizationProvider, MobileDatePicker, MobileTimePicker, TimeView} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {EventService, formatHttpErrorCode} from '@selfcommunity/api-services/src/index';
import {SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventPrivacyType, SCEventRecurrenceType, SCEventType} from '@selfcommunity/types/src/index';
import {Logger} from '@selfcommunity/utils/src/index';
import classNames from 'classnames';
import enLocale from 'date-fns/locale/en-US';
import itLocale from 'date-fns/locale/it';
import PubSub from 'pubsub-js';
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {EVENT_DESCRIPTION_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH} from '../../constants/Event';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  name: `${PREFIX}-name`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LiveStreamFormProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  livestream?: SCEventType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCEventType) => void;

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
 *> API documentation for the Community-JS LiveStreamForm component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|
 |title|.SCLiveStreamForm-title|Styles applied to the title element.|
 |cover|.SCLiveStreamForm-cover|Styles applied to the cover field.|
 |form|.SCLiveStreamForm-form|Styles applied to the form element.|
 |name|.SCLiveStreamForm-name|Styles applied to the name field.|
 |description|.SCLiveStreamForm-description|Styles applied to the description field.|
 |content|.SCLiveStreamForm-content|Styles applied to the  element.|
 |error|.SCLiveStreamForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function LiveStreamForm(inProps: LiveStreamFormProps): JSX.Element {
  //PROPS
  const props: LiveStreamFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSuccess, onError, event = null, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

  const initialFieldState: InitialFieldState = {
    link: event?.link || '',
    name: event?.name || '',
    description: event ? event.description : '',
    isSubmitting: false
  };

  // STATE
  const [field, setField] = useState<InitialFieldState>(initialFieldState);
  const [error, setError] = useState<any>({});

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const privateEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_PRIVATE_ENABLED].value,
    [scPreferences.preferences]
  );
  const visibilityEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_VISIBILITY_ENABLED].value,
    [scPreferences.preferences]
  );
  const disablePastStartTime = useMemo(() => field.startDate.getDate() === getNewDate().getDate(), [field]);
  const disablePastEndTime = useMemo(() => field.endDate.getDate() === getNewDate().getDate(), [field]);

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
   * Notify when a group info changed
   * @param data
   */
  const notifyChanges = useCallback(
    (data: SCEventType) => {
      if (event) {
        // Edit group
        PubSub.publish(`${SCTopicType.EVENT}.${SCGroupEventType.EDIT}`, data);
      } else {
        // Create group
        PubSub.publish(`${SCTopicType.EVENT}.${SCGroupEventType.CREATE}`, data);
      }
    },
    [event]
  );

  const handleGeoData = useCallback((data: Geolocation) => {
    setField((prev) => ({
      ...prev,
      ...data
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, ['isSubmitting']: true}));

    const formData = new FormData();

    if (field.imageOriginalFile) {
      formData.append('image_original', field.imageOriginalFile);
    }

    formData.append('name', field.name);
    formData.append('start_date', combineDateAndTime(field.startDate, field.startTime));
    formData.append('recurring', field.recurring);
    formData.append('end_date', combineDateAndTime(field.endDate, field.endTime));
    formData.append('location', field.location);

    if (field.location === SCEventLocationType.ONLINE) {
      formData.append('link', field.link);
    } else if (field.location === SCEventLocationType.PERSON) {
      formData.append('geolocation', field.geolocation);
      formData.append('geolocation_lat', field.lat.toString());
      formData.append('geolocation_lng', field.lng.toString());
    }

    if (privateEnabled) {
      formData.append('privacy', field.isPublic ? SCEventPrivacyType.PUBLIC : SCEventPrivacyType.PRIVATE);
    }

    if (visibilityEnabled) {
      formData.append('visible', 'true');
    }

    formData.append('description', field.description);

    let eventService: Promise<SCEventType>;
    if (event) {
      eventService = EventService.updateEvent(event.id, formData as unknown as SCEventType, {headers: {'Content-Type': 'multipart/form-data'}});
    } else {
      eventService = EventService.createEvent(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    eventService
      .then((data) => {
        notifyChanges(data);
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        onSuccess?.(data);
      })
      .catch((e) => {
        const _error = formatHttpErrorCode(e);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (Object.values(_error)[0].error === 'unique') {
          setError({
            ...error,
            ['nameError']: <FormattedMessage id="ui.liveStreamForm.name.error.unique" defaultMessage="ui.liveStreamForm.name.error.unique" />
          });
        } else {
          setError({...error, ..._error});
        }

        setField((prev) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
        onError?.(e);
      });
  }, [field, privateEnabled, visibilityEnabled, onSuccess, onError]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      setField((prev) => ({...prev, [name]: value}));

      if (error[`${name}Error`]) {
        delete error[`${name}Error`];

        setError(error);
      }
    },
    [error]
  );

  const handleChangeDateTime = useCallback(
    (value: FieldStateValues, name: FieldStateKeys) => {
      setField((prev) => ({...prev, [name]: value}));
      if (error[`${name}Error`]) {
        delete error[`${name}Error`];

        setError(error);
      } else if (error['endDateError']) {
        delete error['endDateError'];

        setError(error);
      }
    },
    [error]
  );

  const shouldDisabledDate = useCallback(
    (date: Date) => {
      let disabled = false;

      switch (field.recurring) {
        case SCEventRecurrenceType.DAILY:
          disabled = date.getTime() > getLaterDaysDate(DAILY_LATER_DAYS).getTime();
          break;
        case SCEventRecurrenceType.WEEKLY:
          disabled = date.getTime() > getLaterDaysDate(WEEKLY_LATER_DAYS).getTime();
          break;
        case SCEventRecurrenceType.MONTHLY:
          disabled = date.getTime() > getLaterDaysDate(MONTHLY_LATER_DAYS).getTime();
          break;
        case SCEventRecurrenceType.NEVER:
        default:
          disabled = date.getTime() > getLaterDaysDate(NEVER_LATER_DAYS).getTime();
      }

      if (field.startDate.getDate() > date.getDate()) {
        disabled = true;
      }

      return disabled;
    },
    [field]
  );

  const shouldDisabledTime = useCallback((date: Date, _view: TimeView) => field.startTime.getTime() > date.getTime(), [field]);

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <UploadEventCover isCreationMode={true} onChange={handleChangeCover} />
      </Paper>
      <FormGroup className={classes.form}>
        <TextField
          required
          className={classes.name}
          placeholder={`${intl.formatMessage(messages.name)}`}
          margin="normal"
          value={field.name}
          name="name"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{EVENT_TITLE_MAX_LENGTH - field.name.length}</Typography>
          }}
          error={Boolean(field.name.length > EVENT_TITLE_MAX_LENGTH) || Boolean(error['nameError'])}
          helperText={
            field.name.length > EVENT_TITLE_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.name.error.maxLength" defaultMessage="ui.liveStreamForm.name.error.maxLength" />
            ) : error['nameError'] ? (
              error['nameError']
            ) : null
          }
        />
        <Box className={classes.dateTime}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}>
            <MobileDatePicker
              className={classes.picker}
              disablePast
              label={
                field.startDate && <FormattedMessage id="ui.liveStreamForm.date.placeholder" defaultMessage="ui.liveStreamForm.date.placeholder" />
              }
              value={field.startDate}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.startDate)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>CalendarIcon</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.liveStreamForm.date.title" defaultMessage="ui.liveStreamForm.date.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'startDate')}
            />
            <MobileTimePicker
              className={classes.picker}
              disablePast={disablePastStartTime}
              label={
                field.startTime && <FormattedMessage id="ui.liveStreamForm.time.placeholder" defaultMessage="ui.liveStreamForm.time.placeholder" />
              }
              value={field.startTime}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.startTime)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>access_time</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              slotProps={{
                toolbar: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  toolbarTitle: <FormattedMessage id="ui.liveStreamForm.time.title" defaultMessage="ui.liveStreamForm.time.title" />
                }
              }}
              onChange={(value) => handleChangeDateTime(value, 'startTime')}
            />
          </LocalizationProvider>
        </Box>
        <FormControl className={classes.frequency}>
          {field.recurring !== SCEventRecurrenceType.NEVER && <InputLabel id="recurring">{`${intl.formatMessage(messages.frequency)}`}</InputLabel>}
          <Select
            name="recurring"
            label={field.recurring !== SCEventRecurrenceType.NEVER && `${intl.formatMessage(messages.frequency)}`}
            labelId="recurring"
            value={field.recurring}
            onChange={handleChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em>{`${intl.formatMessage(messages.frequencyPlaceholder)}`}</em>;
              }

              return (
                <FormattedMessage
                  id={`ui.liveStreamForm.frequency.${selected}.placeholder`}
                  defaultMessage={`ui.liveStreamForm.frequency.${selected}.placeholder`}
                />
              );
            }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <Icon>frequency</Icon>
                </IconButton>
              </InputAdornment>
            }>
            {Object.values(SCEventRecurrenceType).map((f) => (
              <MenuItem value={f} key={f}>
                <FormattedMessage
                  id={`ui.liveStreamForm.frequency.${f}.placeholder`}
                  defaultMessage={`ui.liveStreamForm.frequency.${f}.placeholder`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className={classes.dateTime}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}>
            <MobileDatePicker
              className={classes.picker}
              disablePast
              minDate={field.startDate}
              label={<FormattedMessage id="ui.liveStreamForm.date.end.placeholder" defaultMessage="ui.liveStreamForm.date.end.placeholder" />}
              value={field.endDate}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.endDate)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>calendar_off</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
              onChange={(value) => handleChangeDateTime(value, 'endDate')}
              shouldDisableDate={shouldDisabledDate}
            />
            <MobileTimePicker
              className={classes.picker}
              disablePast={disablePastEndTime}
              label={
                field.endTime && (
                  <FormattedMessage id="ui.liveStreamForm.time.end.placeholder" defaultMessage="ui.liveStreamForm.time.end.placeholder" />
                )
              }
              value={field.endTime}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: `${intl.formatMessage(messages.endTime)}`,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <Icon>access_time</Icon>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(error['endDateError'])}
                    helperText={
                      error['endDateError']?.error ? (
                        <FormattedMessage id="ui.liveStreamForm.time.end.error.invalid" defaultMessage="ui.liveStreamForm.time.end.error.invalid" />
                      ) : null
                    }
                  />
                )
              }}
              onChange={(value) => handleChangeDateTime(value, 'endTime')}
              shouldDisableTime={shouldDisabledTime}
            />
          </LocalizationProvider>
        </Box>
        <EventAddress forwardGeolocationData={handleGeoData} event={event ?? null} />
        {privateEnabled && (
          <Box className={classes.privacySection}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography className={classNames(classes.switchLabel, {[classes.active]: !field.isPublic})}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.liveStreamForm.privacy.private" defaultMessage="ui.liveStreamForm.privacy.private" />
              </Typography>
              <Switch
                className={classes.switch}
                checked={field.isPublic}
                onChange={() => setField((prev) => ({...prev, ['isPublic']: !field.isPublic}))}
                disabled={event && !field.isPublic}
              />
              <Typography className={classNames(classes.switchLabel, {[classes.active]: field.isPublic})}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.liveStreamForm.privacy.public" defaultMessage="ui.liveStreamForm.privacy.public" />
              </Typography>
            </Stack>
            <Typography variant="body2" textAlign="center" className={classes.privacySectionInfo}>
              {field.isPublic ? (
                <FormattedMessage
                  id="ui.liveStreamForm.privacy.public.info"
                  defaultMessage="ui.liveStreamForm.privacy.public.info"
                  values={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    b: (chunks) => <strong>{chunks}</strong>
                  }}
                />
              ) : (
                <FormattedMessage
                  id="ui.liveStreamForm.privacy.private.info"
                  defaultMessage="ui.liveStreamForm.private.public.info"
                  values={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    b: (chunks) => <strong>{chunks}</strong>
                  }}
                />
              )}
            </Typography>
          </Box>
        )}
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
                {field.description?.length ? EVENT_DESCRIPTION_MAX_LENGTH - field.description.length : EVENT_DESCRIPTION_MAX_LENGTH}
              </Typography>
            )
          }}
          error={Boolean(field.description?.length > EVENT_DESCRIPTION_MAX_LENGTH)}
          helperText={
            field.description?.length > EVENT_DESCRIPTION_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.description.error.maxLength" defaultMessage="ui.liveStreamForm.description.error.maxLength" />
            ) : null
          }
        />
        <Box className={classes.actions}>
          <LoadingButton
            loading={field.isSubmitting}
            disabled={
              !field.name ||
              !field.startDate ||
              !field.startTime ||
              !field.endDate ||
              !field.endTime ||
              (field.location === SCEventLocationType.ONLINE && !field.link) ||
              (field.location === SCEventLocationType.PERSON && !field.geolocation) ||
              (field.recurring !== SCEventRecurrenceType.NEVER && !field.endDate && !field.endTime) ||
              Object.keys(error).length !== 0 ||
              field.name.length > EVENT_TITLE_MAX_LENGTH ||
              field.description.length > EVENT_DESCRIPTION_MAX_LENGTH
            }
            variant="contained"
            onClick={handleSubmit}
            color="secondary">
            {event ? (
              <FormattedMessage id="ui.liveStreamForm.button.edit" defaultMessage="ui.liveStreamForm.button.edit" />
            ) : (
              <FormattedMessage id="ui.liveStreamForm.button.create" defaultMessage="ui.liveStreamForm.button.create" />
            )}
          </LoadingButton>
        </Box>
      </FormGroup>
    </Root>
  );
}
