import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, CircularProgress, IconButton, InputAdornment, MenuItem, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import {defineMessages, useIntl} from 'react-intl';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, formatHttpError, HttpResponse} from '@selfcommunity/api-services';
import {camelCase} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../../constants/UserProfile';
import classNames from 'classnames';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import UsernameTextField from '../../../shared/UsernameTextField';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../../types';
import MetadataField from '../../../shared/MetadataField';

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
  ['& .${classes.field} .MuiSelect-icon']: {
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
  onEditSuccess?: () => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const GENDERS = ['Male', 'Female', 'Unspecified'];

export default function PublicInfo(inProps: PublicInfoProps): JSX.Element {
  // PROPS
  const props: PublicInfoProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, fields = [...DEFAULT_FIELDS], onEditSuccess = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const metadataDefinitions = useMemo(() => {
    return scPreferences.preferences && SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS in scPreferences.preferences
      ? JSON.parse(scPreferences.preferences[SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS].value)
      : null;
  }, [scPreferences.preferences]);

  // STATE
  const [user, setUser] = useState<SCUserType>(scUserContext.user);
  const [error, setError] = useState<any>({});
  const [editing, setEditing] = useState<SCUserProfileFields[]>([]);
  const [saving, setSaving] = useState<SCUserProfileFields[]>([]);

  // INTL
  const intl = useIntl();

  // EFFECTS
  useDeepCompareEffectNoCheck(() => {
    setUser(scUserContext.user);
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
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      if (user[field] === scUserContext.user[field]) {
        setEditing(editing.filter((f) => f !== field));
        return;
      }
      setSaving([...saving, field]);
      http
        .request({
          url: Endpoints.UserPatch.url({id: user.id}),
          method: Endpoints.UserPatch.method,
          data: {[field]: user[field]}
        })
        .then((res: HttpResponse<SCUserType>) => {
          scUserContext.updateUser(res.data);
        })
        .catch((error) => {
          setError({...error, ...formatHttpError(error)});
        })
        .then(() => {
          setEditing(editing.filter((f) => f !== field));
          setSaving(saving.filter((f) => f !== field));
          if (onEditSuccess) {
            onEditSuccess();
          }
        });
    };
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [event.target.name]: event.target.value});
  };

  // RENDER
  const renderField = (field) => {
    const isEditing = editing.includes(field);
    const isSaving = saving.includes(field);
    const camelField = camelCase(field);
    const _error = error !== null && error[`${camelField}Error`] && error[`${camelField}Error`].error;
    const component = {element: TextField};
    let label = intl.formatMessage({
      id: `ui.userProfileInfo.${camelField}`,
      defaultMessage: `ui.userProfileInfo.${field}`
    });
    let props: any = {
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!isEditing ? (
              <IconButton onClick={handleEdit(field)} edge="end">
                <Icon>edit</Icon>
              </IconButton>
            ) : isSaving ? (
              <CircularProgress size={10} />
            ) : (
              <IconButton onClick={handleSave(field)} edge="end" color={user[field] === scUserContext.user[field] ? 'default' : 'primary'}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} key={field}>
            <DatePicker
              label={intl.formatMessage({
                id: `ui.userProfileInfo.${camelCase(field)}`,
                defaultMessage: `ui.userProfileInfo.${field}`
              })}
              value={user[field]}
              onChange={(newValue) => {
                setUser({...user, [field]: newValue.toJSON().split('T')[0]}); // FIX for ensuring API format
              }}
              disableFuture
              disabled={!isEditing || isSaving}
              renderInput={(params) => {
                const {InputProps, ...rest} = params;
                InputProps.endAdornment = (
                  <>
                    {InputProps.endAdornment}
                    {props.InputProps.endAdornment}
                  </>
                );
                return <TextField {...rest} className={classes.field} fullWidth InputProps={InputProps} />;
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
        if (metadataDefinitions[field]) {
          return (
            <MetadataField
              key={field}
              {...props}
              className={classes.field}
              name={field}
              fullWidth
              label={label}
              value={user[field] || ''}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              error={_error}
              helperText={_error}
              metadata={metadataDefinitions[field]}
            />
          );
        }
        break;
    }
    return (
      <component.element
        key={field}
        {...props}
        className={classes.field}
        name={field}
        fullWidth
        label={label}
        value={user[field] || ''}
        onChange={handleChange}
        disabled={!isEditing || isSaving}
        error={_error}
        helperText={_error}>
        {content}
      </component.element>
    );
  };

  if (fields.length === 0 || !user) {
    return null;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {fields.map((field) => {
        return renderField(field);
      })}
    </Root>
  );
}
