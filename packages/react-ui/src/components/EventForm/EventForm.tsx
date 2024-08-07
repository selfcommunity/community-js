import React, {useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
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
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {PREFIX} from './constants';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {LoadingButton} from '@mui/lab';
import {EVENT_DESCRIPTION_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH} from '../../constants/Event';
import {SCEventLocationType, SCEventPrivacyType, SCEventRecurrenceType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {EventService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import UploadEventCover from './UploadEventCover';
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import EventAddress from './EventAddress';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';

const messages = defineMessages({
  name: {
    id: 'ui.eventForm.name.placeholder',
    defaultMessage: 'ui.eventForm.name.placeholder'
  },
  description: {
    id: 'ui.eventForm.description.placeholder',
    defaultMessage: 'ui.eventForm.description.placeholder'
  },
  startDate: {
    id: 'ui.eventForm.date.placeholder',
    defaultMessage: 'ui.eventForm.date.placeholder'
  },
  startTime: {
    id: 'ui.eventForm.time.placeholder',
    defaultMessage: 'ui.eventForm.time.placeholder'
  },
  frequency: {
    id: 'ui.eventForm.frequency.label',
    defaultMessage: 'ui.eventForm.frequency.label'
  },
  frequencyPlaceholder: {
    id: 'ui.eventForm.frequency.none.placeholder',
    defaultMessage: 'ui.eventForm.frequency.none.placeholder'
  },
  endDate: {
    id: 'ui.eventForm.date.end.placeholder',
    defaultMessage: 'ui.eventForm.date.end.placeholder'
  },
  endTime: {
    id: 'ui.eventForm.time.end.placeholder',
    defaultMessage: 'ui.eventForm.time.end.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  title: `${PREFIX}-title`,
  cover: `${PREFIX}-cover`,
  picker: `${PREFIX}-picker`,
  dateTime: `${PREFIX}-date-time`,
  frequency: `${PREFIX}-frequency`,
  form: `${PREFIX}-form`,
  switch: `${PREFIX}-switch`,
  switchLabel: `${PREFIX}-switch-label`,
  name: `${PREFIX}-name`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  privacySection: `${PREFIX}-privacy-section`,
  privacySectionInfo: `${PREFIX}-privacy-section-info`,
  error: `${PREFIX}-error`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventFormProps extends BaseDialogProps {
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
   * On success callback function
   * @default null
   */
  onSuccess?: (data: any) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS  Event Form component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {EventForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEventForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventForm-root|Styles applied to the root element.|
 |active|.SCEventForm-active|Styles applied to the  active element.|
 |title|.SCEventForm-title|Styles applied to the title element.|
 |cover|.SCEventForm-cover|Styles applied to the cover field.|
 |form|.SCEventForm-form|Styles applied to the form element.|
 |switch|.SCEventForm-switch|Styles applied to the switch element.|
 |switchLabel|.SCEventForm-switch-label|Styles applied to the switchLabel element.|
 |name|.SCEventForm-name|Styles applied to the name field.|
 |description|.SCEventForm-description|Styles applied to the description field.|
 |content|.SCEventForm-content|Styles applied to the  element.|
 |privacySection|.SCEventForm-privacy-section|Styles applied to the privacy section.|
 |privacySectionInfo|.SCEventForm-privacy-section-info|Styles applied to the privacy info section.|
 |error|.SCEventForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function EventForm(inProps: EventFormProps): JSX.Element {
  //PROPS
  const props: EventFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, onSuccess, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

  const initialFieldState = {
    emotionalImageOriginal: '',
    emotionalImageOriginalFile: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    location: '',
    geolocation: '',
    lat: null,
    lng: null,
    link: '',
    recurring: SCEventRecurrenceType.NEVER,
    name: '',
    description: '',
    isPublic: true,
    isSubmitting: false,
    showEndDateTime: false
  };

  // STATE
  const [field, setField] = useState<any>(initialFieldState);
  const [error, setError] = useState<any>({});

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const privateEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_PRIVATE_ENABLED].value,
    [scPreferences.preferences]
  );

  const _backgroundCover = {
    ...(field.emotionalImageOriginal
      ? {background: `url('${field.emotionalImageOriginal}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  const combineDateAndTime = (date, time) => {
    if (date && time) {
      const combined = new Date(date);
      combined.setHours(time.getHours());
      combined.setMinutes(time.getMinutes());
      combined.setSeconds(time.getSeconds());
      combined.setMilliseconds(time.getMilliseconds());
      return combined.toISOString();
    }
    return null;
  };

  function handleChangeCover(cover) {
    setField((prev: any) => ({...prev, ['emotionalImageOriginalFile']: cover}));
    const reader = new FileReader();
    reader.onloadend = () => {
      setField((prev: any) => ({...prev, ['emotionalImageOriginal']: reader.result}));
    };
    reader.readAsDataURL(cover);
    if (error.emotionalImageOriginalError) {
      delete error.emotionalImageOriginalError;
      setError(error);
    }
  }

  const handleGeoData = (data) => {
    setField((prev) => ({
      ...prev,
      ...data
    }));
  };

  const handleSubmit = () => {
    setField((prev: any) => ({...prev, ['isSubmitting']: true}));
    const formData: any = new FormData();
    if (field.emotionalImageOriginalFile) {
      formData.append('emotional_image_original', field.emotionalImageOriginalFile);
    }
    formData.append('name', field.name);
    formData.append('start_date', combineDateAndTime(field.startDate, field.startTime));
    formData.append('recurring', field.recurring);
    if (field.endDate) {
      formData.append('end_date', combineDateAndTime(field.endDate, field.endTime));
    }
    formData.append('location', field.location);
    if (field.location === SCEventLocationType.ONLINE) {
      formData.append('link', field.link);
    }
    if (field.location === SCEventLocationType.PERSON) {
      formData.append('geolocation', field.geolocation);
      formData.append('geolocation_lat', field.lat);
      formData.append('geolocation_lng', field.lng);
    }
    if (privateEnabled) {
      formData.append('privacy', field.isPublic ? SCEventPrivacyType.PUBLIC : SCEventPrivacyType.PRIVATE);
    }
    formData.append('description', field.description);

    EventService.createEvent(formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data: any) => {
        onSuccess && onSuccess(data);
        onClose && onClose();
        setField((prev: any) => ({...prev, ['isSubmitting']: false}));
      })
      .catch((e) => {
        setError({...error, ...formatHttpErrorCode(e)});
        setField((prev: any) => ({...prev, ['isSubmitting']: false}));
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setField((prev: any) => ({...prev, [name]: value}));
    if (error[`${name}Error`]) {
      delete error[`${name}Error`];
      setError(error);
    }
  };

  const handleChangeDateTime = (value, name) => {
    setField((prev: any) => ({...prev, [name]: value}));
    if (error[`${name}Error`]) {
      delete error[`${name}Error`];
      setError(error);
    }
  };

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      title={<FormattedMessage id="ui.eventForm.title" defaultMessage="ui.eventForm.title" />}
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      actions={
        <LoadingButton
          loading={field.isSubmitting}
          disabled={
            !field.name ||
            (!field.startDate && !field.startTime) ||
            (SCEventLocationType.ONLINE && !field.link) ||
            ((field.recurring !== SCEventRecurrenceType.NEVER) && (!field.endDate && !field.endTime)) ||
            Object.keys(error).length !== 0 ||
            field.name.length > EVENT_TITLE_MAX_LENGTH ||
            field.description.length > EVENT_DESCRIPTION_MAX_LENGTH
          }
          variant="contained"
          onClick={handleSubmit}
          color="secondary">
          {<FormattedMessage id="ui.eventForm.button.create" defaultMessage="ui.eventForm.button.create" />}
        </LoadingButton>
      }
      {...rest}>
      <>
        <Paper style={_backgroundCover} classes={{root: classes.cover}}>
          <UploadEventCover onChange={handleChangeCover} />
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
            error={Boolean(field?.name?.length > EVENT_TITLE_MAX_LENGTH)}
            helperText={
              field?.name?.length > EVENT_TITLE_MAX_LENGTH ? (
                <FormattedMessage id="ui.eventForm.name.error.maxLength" defaultMessage="ui.eventForm.name.error.maxLength" />
              ) : null
            }
          />
          <Box className={classes.dateTime}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}>
              <MobileDatePicker
                className={classes.picker}
                disablePast
                label={field.startDate && <FormattedMessage id="ui.eventForm.date.placeholder" defaultMessage="ui.eventForm.date.placeholder" />}
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
                              <Icon>calendar_off</Icon>
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
                    toolbarTitle: <FormattedMessage id="ui.eventForm.date.title" defaultMessage="ui.eventForm.date.title" />
                  }
                }}
                onChange={(value) => handleChangeDateTime(value, 'startDate')}
              />
              <MobileTimePicker
                className={classes.picker}
                label={field.startTime && <FormattedMessage id="ui.eventForm.time.placeholder" defaultMessage="ui.eventForm.time.placeholder" />}
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
                    toolbarTitle: <FormattedMessage id="ui.eventForm.time.title" defaultMessage="ui.eventForm.time.title" />
                  }
                }}
                onChange={(value) => handleChangeDateTime(value, 'startTime')}
              />
            </LocalizationProvider>
          </Box>
          <FormControl className={classes.frequency}>
            {field.recurring !== SCEventRecurrenceType.NEVER && <InputLabel id="frequency">{`${intl.formatMessage(messages.frequency)}`}</InputLabel>}
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
                    id={`ui.eventForm.frequency.${selected}.placeholder`}
                    defaultMessage={`ui.eventForm.frequency.${selected}.placeholder`}
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
                  <FormattedMessage id={`ui.eventForm.frequency.${f}.placeholder`} defaultMessage={`ui.eventForm.frequency.${f}.placeholder`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(field.showEndDateTime || field.recurring !== SCEventRecurrenceType.NEVER) && (
            <Box className={classes.dateTime}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}>
                <MobileDatePicker
                  className={classes.picker}
                  disablePast
                  label={
                    field.endDate && <FormattedMessage id="ui.eventForm.date.end.placeholder" defaultMessage="ui.eventForm.date.end.placeholder" />
                  }
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
                />
                <MobileTimePicker
                  className={classes.picker}
                  label={
                    field.endTime && <FormattedMessage id="ui.eventForm.time.end.placeholder" defaultMessage="ui.eventForm.time.end.placeholder" />
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
                      />
                    )
                  }}
                  onChange={(value) => handleChangeDateTime(value, 'endTime')}
                />
              </LocalizationProvider>
            </Box>
          )}
          <Button variant="text" color="secondary" onClick={() => setField((prev: any) => ({...prev, ['showEndDateTime']: !field.showEndDateTime}))}>
            <FormattedMessage
              id="ui.eventForm.dateTime.placeholder"
              defaultMessage="ui.eventForm.dateTime.placeholder"
              values={{symbol: field.showEndDateTime ? '-' : '+'}}
            />
          </Button>
          <EventAddress forwardGeolocationData={handleGeoData} />
          {privateEnabled && (
            <Box className={classes.privacySection}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Typography className={classNames(classes.switchLabel, {[classes.active]: !field.isPublic})}>
                  <Icon>private</Icon>
                  <FormattedMessage id="ui.eventForm.privacy.private" defaultMessage="ui.eventForm.privacy.private" />
                </Typography>
                <Switch
                  className={classes.switch}
                  checked={field.isPublic}
                  onChange={() => setField((prev: any) => ({...prev, ['isPublic']: !field.isPublic}))}
                />
                <Typography className={classNames(classes.switchLabel, {[classes.active]: field.isPublic})}>
                  <Icon>public</Icon>
                  <FormattedMessage id="ui.eventForm.privacy.public" defaultMessage="ui.eventForm.privacy.public" />
                </Typography>
              </Stack>
              <Typography variant="body2" textAlign="center" className={classes.privacySectionInfo}>
                {field.isPublic ? (
                  <FormattedMessage
                    id="ui.eventForm.privacy.public.info"
                    defaultMessage="ui.eventForm.privacy.public.info"
                    values={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      b: (chunks) => <strong>{chunks}</strong>
                    }}
                  />
                ) : (
                  <>
                    {field.privacy === true ? (
                      <FormattedMessage
                        id="ui.eventForm.privacy.private.info.edit"
                        defaultMessage="ui.eventForm.private.public.info.edit"
                        values={{
                          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                          // @ts-ignore
                          b: (chunks) => <strong>{chunks}</strong>
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id="ui.eventForm.privacy.private.info"
                        defaultMessage="ui.eventForm.private.public.info"
                        values={{
                          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                          // @ts-ignore
                          b: (chunks) => <strong>{chunks}</strong>
                        }}
                      />
                    )}
                  </>
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
                <FormattedMessage id="ui.eventForm.description.error.maxLength" defaultMessage="ui.eventForm.description.error.maxLength" />
              ) : null
            }
          />
        </FormGroup>
      </>
    </Root>
  );
}
