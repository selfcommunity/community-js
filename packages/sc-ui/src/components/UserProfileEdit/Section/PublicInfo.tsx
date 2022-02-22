import React, {ChangeEvent, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, CircularProgress, IconButton, InputAdornment, MenuItem, TextField} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/CheckOutlined';
import {defineMessages, useIntl} from 'react-intl';
import {Endpoints, http, SCUserContextType, SCUserFields, SCUserType, StringUtils, useSCUser} from '@selfcommunity/core';
import {DEFAULT_FIELDS} from '../../../constants/UserProfile';
import classNames from 'classnames';
import {AxiosResponse} from 'axios';
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const messages = defineMessages({
  realName: {
    id: 'ui.userProfileInfo.realName',
    defaultMessage: 'ui.userProfileInfo.realName'
  },
  dateJoined: {
    id: 'ui.userProfileInfo.dateJoined',
    defaultMessage: 'ui.userProfileInfo.dateJoined'
  },
  bio: {
    id: 'ui.userProfileInfo.bio',
    defaultMessage: 'ui.userProfileInfo.bio'
  },
  location: {
    id: 'ui.userProfileInfo.location',
    defaultMessage: 'ui.userProfileInfo.location'
  },
  dateOfBirth: {
    id: 'ui.userProfileInfo.dateOfBirth',
    defaultMessage: 'ui.userProfileInfo.dateOfBirth'
  },
  description: {
    id: 'ui.userProfileInfo.description',
    defaultMessage: 'ui.userProfileInfo.description'
  },
  gender: {
    id: 'ui.userProfileInfo.gender',
    defaultMessage: 'ui.userProfileInfo.gender'
  },
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
  },
  website: {
    id: 'ui.userProfileInfo.website',
    defaultMessage: 'ui.userProfileInfo.website'
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
  fields?: SCUserFields[];

  /**
   * Any other properties
   */
  [p: string]: any;
}

const GENDERS = ['Male', 'Female', 'Unspecified'];

export default function PublicInfo(props: PublicInfoProps): JSX.Element {
  // PROPS
  const {id = null, className = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [user, setUser] = useState<SCUserType>(scUserContext.user);
  const [editing, setEditing] = useState<SCUserFields[]>([]);
  const [saving, setSaving] = useState<SCUserFields[]>([]);

  // INTL
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    setUser(scUserContext.user);
  }, [scUserContext.user]);

  // HANDLERS
  const handleEdit = (field: SCUserFields) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      setEditing([...editing, field]);
    };
  };

  const handleSave = (field: SCUserFields) => {
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
        .then((res: AxiosResponse<SCUserType>) => {
          scUserContext.updateUser(res.data);
          setEditing(editing.filter((f) => f !== field));
          setSaving(saving.filter((f) => f !== field));
        })
        .catch((error) => {
          console.log(error);
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
    const props: any = {
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!isEditing ? (
              <IconButton onClick={handleEdit(field)} edge="end">
                <EditIcon />
              </IconButton>
            ) : isSaving ? (
              <CircularProgress size={10} />
            ) : (
              <IconButton onClick={handleSave(field)} edge="end" color={user[field] === scUserContext.user[field] ? 'default' : 'primary'}>
                <SaveIcon />
              </IconButton>
            )}
          </InputAdornment>
        )
      }
    };
    let content = null;

    switch (field) {
      case SCUserFields.DATE_JOINED:
        return null;
      case SCUserFields.DATE_OF_BIRTH:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} key={field}>
            <DatePicker
              label={intl.formatMessage(messages[StringUtils.camelCase(field)])}
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
      case SCUserFields.BIO:
        props.multiline = true;
        break;
      case SCUserFields.WEBSITE:
        props.type = 'url';
        props.pattern = 'https://.*';
        props.size = '30';
        break;
      case SCUserFields.GENDER:
        props.select = true;
        content = GENDERS.map((gender) => (
          <MenuItem key={gender} value={gender}>
            {intl.formatMessage(messages[`gender${gender}`])}
          </MenuItem>
        ));
        break;
      default:
        break;
    }
    return (
      <TextField
        key={field}
        {...props}
        className={classes.field}
        name={field}
        fullWidth
        label={intl.formatMessage(messages[StringUtils.camelCase(field)])}
        value={user[field]}
        onChange={handleChange}
        disabled={!isEditing || isSaving}>
        {content}
      </TextField>
    );
  };

  if (fields.length === 0) {
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
