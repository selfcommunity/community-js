import React, {ChangeEvent, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, CircularProgress, IconButton, InputAdornment, MenuItem, TextField, useMediaQuery, useTheme} from '@mui/material';
import Icon from '@mui/material/Icon';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCUserType} from '@selfcommunity/types';
import {Endpoints, formatHttpErrorCode, http, HttpResponse} from '@selfcommunity/api-services';
import {camelCase, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCContext,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../../constants/UserProfile';
import classNames from 'classnames';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import UsernameTextField from '../../../shared/UsernameTextField';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../../types';
import MetadataField from '../../../shared/MetadataField';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {format, isBefore, isValid, parseISO, startOfHour} from 'date-fns';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';

const messages = defineMessages({
  genderMale: {
    id: 'ui.userProfileEditPublicInfo.genderMale',
    defaultMessage: 'ui.userProfileEditPublicInfo.genderMale'
  },
  genderFemale: {
    id: 'ui.userProfileEditPublicInfo.genderFemale',
    defaultMessage: 'ui.userProfileEditPublicInfo.genderFemale'
  },
  genderUnspecified: {
    id: 'ui.userProfileEditPublicInfo.genderUnspecified',
    defaultMessage: 'ui.userProfileEditPublicInfo.genderUnspecified'
  }
});

const PREFIX = 'SCUserProfileEditSectionPublicInfo';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.field}`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`& .${classes.field} .MuiSelect-icon`]: {
    right: theme.spacing(5)
  }
}));

export interface PublicInfoProps {
  /**
   * Id of user object
   * @default null
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * User fields to display in the profile
   * @default [real_name, date_joined, date_of_birth, website, description, bio]
   */
  fields?: SCUserProfileFields[];

  /**
   * Callback on edit data with success
   */
  onEditSuccess?: (editedField?: Record<string, any>) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

const GENDERS = ['Male', 'Female', 'Unspecified'];
const DATEPICKER_MINDATE = new Date(1000, 1, 1);

export default function PublicInfo(inProps: PublicInfoProps): JSX.Element {
  // PROPS
  const props: PublicInfoProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, fields = [...DEFAULT_FIELDS], onEditSuccess = null, ...rest} = props;
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const metadataDefinitions = useMemo(() => {
    if (scPreferences.preferences && SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS in scPreferences.preferences) {
      try {
        return JSON.parse(scPreferences.preferences[SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS].value);
      } catch (e) {
        Logger.error(SCOPE_SC_UI, 'Error on parse user metadata.');
        return {};
      }
    }
    return null;
  }, [scPreferences.preferences]);

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState<SCUserType>();
  const [error, setError] = useState<any>({});
  const [editing, setEditing] = useState<SCUserProfileFields[]>([]);
  const [saving, setSaving] = useState<SCUserProfileFields[]>([]);
  // INTL
  const intl = useIntl();

  // EFFECTS
  useDeepCompareEffectNoCheck(() => {
    if (scUserContext.user) {
      setUser({...scUserContext.user});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
  }, [scUserContext.user]);

  // HANDLERS
  const handleEdit = (field: SCUserProfileFields) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      setEditing([...editing, field]);
      if (error[`${camelCase(field)}Error`]) {
        delete error[`${camelCase(field)}Error`];
        setError(error);
      }
    };
  };

  const handleSave = (field: SCUserProfileFields) => {
    return (event: React.MouseEvent<HTMLButtonElement> | any) => {
      if (user[field] === scUserContext.user[field]) {
        setEditing(editing.filter((f) => f !== field));
        return;
      }
      setSaving([...saving, field]);
      http
        .request({
          url: Endpoints.UserPatch.url({id: user.id}),
          method: Endpoints.UserPatch.method,
          data: {[field]: field === SCUserProfileFields.DATE_OF_BIRTH && user[field] ? format(user[field], 'yyyy-MM-dd') : user[field]}
        })
        .then((res: HttpResponse<SCUserType>) => {
          scUserContext.updateUser(res.data);
          setEditing(editing.filter((f) => f !== field));
          setSaving(saving.filter((f) => f !== field));
          if (onEditSuccess) {
            onEditSuccess();
          }
        })
        .catch((error) => {
          setError({...error, ...formatHttpErrorCode(error)});
          setEditing([...editing, field]);
          setSaving(saving.filter((f) => f !== field));
        });
    };
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [event.target.name]: event.target.value});
    if (error[`${camelCase(event.target.name)}Error`]) {
      delete error[`${camelCase(event.target.name)}Error`];
      setError(error);
    }
  };

  // RENDER
  const renderField = (field) => {
    const isEditing = editing.includes(field);
    const isSaving = saving.includes(field);
    const camelField = camelCase(field);
    const _error = error !== null && error[`${camelField}Error`] && error[`${camelField}Error`].error;
    const component: any = {element: TextField};
    let label = intl.formatMessage({
      id: `ui.userInfo.${camelField}`,
      defaultMessage: `ui.userInfo.${camelField}`
    });

    let props: any = {
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!isEditing ? (
              <IconButton onClick={handleEdit(field)} edge="end" disabled={editing.length !== 0}>
                <Icon>edit</Icon>
              </IconButton>
            ) : isSaving ? (
              <CircularProgress size={10} />
            ) : (
              <IconButton
                disabled={Boolean(_error) || !user[field]}
                onClick={handleSave(field)}
                edge="end"
                color={'secondary'}
                // color={user[field] === scUserContext.user[field] ? 'default' : 'primary'}
              >
                <Icon>check</Icon>
              </IconButton>
            )}
          </InputAdornment>
        )
      }
    };
    let content = null;

    switch (field) {
      case SCUserProfileFields.USERNAME:
        component.element = UsernameTextField;
        break;
      case SCUserProfileFields.DATE_JOINED:
        return null;
      case SCUserProfileFields.DATE_OF_BIRTH:
        return (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            key={field}
            adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}>
            <DatePicker
              label={intl.formatMessage({
                id: `ui.userInfo.${camelCase(field)}`,
                defaultMessage: `ui.userInfo.${field}`
              })}
              defaultValue={user[field] ? parseISO(user[field]) : null}
              minDate={DATEPICKER_MINDATE}
              onChange={(newValue) => {
                const u = user;
                const field = SCUserProfileFields.DATE_OF_BIRTH;
                const camelField = camelCase(field);
                if ((isValid(newValue) && isBefore(startOfHour(DATEPICKER_MINDATE), newValue) && isBefore(newValue, new Date())) || !newValue) {
                  if (error[`${camelField}Error`]) {
                    const _error = {...error};
                    delete _error[`${camelField}Error`];
                    setError(_error);
                  }
                  u[field] = newValue;
                } else {
                  u[field] = null;
                  setError({
                    [`${camelField}Error`]: {
                      error: intl.formatMessage({id: 'ui.publicInfo.dateOfBirth.error', defaultMessage: 'ui.publicInfo.dateOfBirth.error'})
                    }
                  });
                }
                setUser(u);
              }}
              disableFuture
              disabled={!isEditing || isSaving}
              slots={{
                inputAdornment: (params) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  const {children, ...rest} = params.children.props;
                  return (
                    <InputAdornment position={'end'}>
                      <IconButton {...rest}>{children}</IconButton>
                      {!isEditing ? (
                        <IconButton onClick={handleEdit(SCUserProfileFields.DATE_OF_BIRTH)} edge="end" disabled={editing.length !== 0}>
                          <Icon>edit</Icon>
                        </IconButton>
                      ) : isSaving ? (
                        <CircularProgress size={10} />
                      ) : (
                        <IconButton disabled={Boolean(_error)} onClick={handleSave(SCUserProfileFields.DATE_OF_BIRTH)} edge="end">
                          <Icon>check</Icon>
                        </IconButton>
                      )}
                    </InputAdornment>
                  );
                }
              }}
              onAccept={isMobile ? handleSave(SCUserProfileFields.DATE_OF_BIRTH) : null}
              slotProps={{
                textField: {
                  className: classes.field,
                  fullWidth: true,
                  variant: 'outlined',
                  helperText: _error || null,
                  InputProps: {
                    endAdornment: isMobile && (
                      <>
                        <IconButton disabled={!isEditing}>
                          <Icon>CalendarIcon</Icon>
                        </IconButton>
                        {!isEditing ? (
                          <IconButton onClick={handleEdit(SCUserProfileFields.DATE_OF_BIRTH)} edge="end" disabled={editing.length !== 0}>
                            <Icon>edit</Icon>
                          </IconButton>
                        ) : isSaving ? (
                          <CircularProgress size={10} />
                        ) : null}
                      </>
                    )
                  }
                }
              }}
            />
          </LocalizationProvider>
        );
      case SCUserProfileFields.BIO:
        props.multiline = true;
        break;
      case SCUserProfileFields.WEBSITE:
        props.type = 'url';
        props.pattern = 'https://.*';
        props.size = '30';
        break;
      case SCUserProfileFields.GENDER:
        props.select = true;
        content = GENDERS.map((gender) => (
          <MenuItem key={gender} value={gender}>
            {intl.formatMessage(messages[`gender${gender}`])}
          </MenuItem>
        ));
        break;
      case SCUserProfileFields.TAGS:
        return null;
      default:
        if (metadataDefinitions && metadataDefinitions[field]) {
          return (
            <MetadataField
              id={field}
              key={field}
              {...props}
              className={classes.field}
              name={field}
              fullWidth
              label={label}
              value={user[field] || ''}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              error={Boolean(_error)}
              helperText={
                _error && <FormattedMessage id={`ui.userInfo.metadata.error.${_error}`} defaultMessage={`ui.userInfo.metadata.error.${_error}`} />
              }
              metadata={metadataDefinitions[field]}
            />
          );
        }
        break;
    }
    return (
      <component.element
        id={field}
        key={field}
        {...props}
        className={classes.field}
        name={field}
        fullWidth
        label={label}
        value={user[field] || ''}
        onChange={handleChange}
        disabled={!isEditing || isSaving}
        error={Boolean(_error)}
        helperText={
          _error && <FormattedMessage id={`ui.userInfo.${camelField}.error.${_error}`} defaultMessage={`ui.userInfo.${camelField}.error.${_error}`} />
        }>
        {content}
      </component.element>
    );
  };

  // FIELDS
  const _fields: string[] = [...fields, ...Object.keys(metadataDefinitions)];

  if (_fields.length === 0 || !user) {
    return null;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {_fields.map((field) => {
        return renderField(field);
      })}
    </Root>
  );
}
