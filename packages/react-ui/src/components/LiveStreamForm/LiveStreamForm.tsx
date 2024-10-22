import {LoadingButton} from '@mui/lab';
import {Box, BoxProps, FormGroup, TextField, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {EventService, formatHttpErrorCode} from '@selfcommunity/api-services';
import {SCContextType, SCPreferences, SCPreferencesContextType, useSCContext, useSCPreferences} from '@selfcommunity/react-core';
import {SCEventType, SCLiveStreamType} from '@selfcommunity/types/src/index';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LIVE_STREAM_DESCRIPTION_MAX_LENGTH, LIVE_STREAM_TITLE_MAX_LENGTH, LIVE_STREAM_SLUG_MAX_LENGTH} from '../../constants/LiveStream';
import {PREFIX} from './constants';
import {InitialFieldState} from './types';

const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  title: `${PREFIX}-title`,
  slug: `${PREFIX}-slug`,
  description: `${PREFIX}-description`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
	[`& .${classes.actions}`]: {
		display: 'flex',
		justifyContent: 'flex-end',
		marginTop: theme.spacing(2)
	},
}));

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
  liveStream?: SCLiveStreamType;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCLiveStreamType) => void;

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

const messages = defineMessages({
  title: {
    id: 'ui.liveStreamForm.title.placeholder',
    defaultMessage: 'ui.liveStreamForm.title.placeholder'
  },
  slug: {
    id: 'ui.liveStreamForm.slug.placeholder',
    defaultMessage: 'ui.liveStreamForm.slug.placeholder'
  },
  description: {
    id: 'ui.liveStreamForm.description.placeholder',
    defaultMessage: 'ui.liveStreamForm.description.placeholder'
  }
});

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
  const {className, onSuccess, onError, liveStream = null, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const initialFieldState: InitialFieldState = {
    title: liveStream?.title || '',
    description: liveStream?.description || '',
    slug: liveStream?.slug || '',
    cover: liveStream?.cover || '',
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

  const handleSubmit = useCallback(() => {
    setField((prev) => ({...prev, ['isSubmitting']: true}));

    const formData = new FormData();

    if (visibilityEnabled) {
      formData.append('visible', 'true');
    }

    formData.append('description', field.description);

    let eventService: Promise<SCEventType>;
    if (liveStream) {
      eventService = EventService.updateEvent(liveStream.id, formData as unknown as SCEventType, {headers: {'Content-Type': 'multipart/form-data'}});
    } else {
      eventService = EventService.createEvent(formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    eventService
      .then((data) => {
        setField((prev) => ({...prev, ['isSubmitting']: false}));
        // onSuccess?.(data);
      })
      .catch((e) => {
        const _error = formatHttpErrorCode(e);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (Object.values(_error)[0].error === 'unique') {
          setError({
            ...error,
            ['titleError']: <FormattedMessage id="ui.liveStreamForm.title.error.unique" defaultMessage="ui.liveStreamForm.title.error.unique" />
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

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <FormGroup className={classes.form}>
        <TextField
          required
          className={classes.title}
          placeholder={`${intl.formatMessage(messages.title)}`}
          margin="normal"
          value={field.title}
          name="title"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{LIVE_STREAM_TITLE_MAX_LENGTH - field.title.length}</Typography>
          }}
          error={Boolean(field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH) || Boolean(error['titleError'])}
          helperText={
            field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.title.error.maxLength" defaultMessage="ui.liveStreamForm.title.error.maxLength" />
            ) : error['titleError'] ? (
              error['titleError']
            ) : null
          }
        />
        <TextField
          required
          className={classes.slug}
          placeholder={`${intl.formatMessage(messages.slug)}`}
          margin="normal"
          value={field.slug}
          name="slug"
          onChange={handleChange}
          InputProps={{
            endAdornment: <Typography variant="body2">{LIVE_STREAM_SLUG_MAX_LENGTH - field.title.length}</Typography>
          }}
          error={Boolean(field.slug.length > LIVE_STREAM_SLUG_MAX_LENGTH) || Boolean(error['nameError'])}
          helperText={
            field.title.length > LIVE_STREAM_SLUG_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.slug.error.maxLength" defaultMessage="ui.liveStreamForm.slug.error.maxLength" />
            ) : error['nameError'] ? (
              error['nameError']
            ) : null
          }
        />
        <TextField
          multiline
          rows={4}
          className={classes.description}
          placeholder={`${intl.formatMessage(messages.description)}`}
          margin="normal"
          value={field.description}
          name="description"
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <Typography variant="body2">
                {field.description?.length ? LIVE_STREAM_DESCRIPTION_MAX_LENGTH - field.description.length : LIVE_STREAM_DESCRIPTION_MAX_LENGTH}
              </Typography>
            )
          }}
          error={Boolean(field.description?.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH)}
          helperText={
            field.description?.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH ? (
              <FormattedMessage id="ui.liveStreamForm.description.error.maxLength" defaultMessage="ui.liveStreamForm.description.error.maxLength" />
            ) : null
          }
        />
        <Box className={classes.actions}>
          <LoadingButton
            loading={field.isSubmitting}
            disabled={
              !field.title ||
              Object.keys(error).length !== 0 ||
              field.title.length > LIVE_STREAM_TITLE_MAX_LENGTH ||
              field.description.length > LIVE_STREAM_DESCRIPTION_MAX_LENGTH
            }
            variant="contained"
            onClick={handleSubmit}
            color="secondary">
            {liveStream ? (
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
