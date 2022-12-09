import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Link, Grid, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase, Logger} from '@selfcommunity/utils';
import {SCUserType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCFetchUser, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import UserProfileInfoSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Tags, {TagsComponentType} from '../../shared/Tags';
import PublicInfo from '../UserProfileEdit/Section/PublicInfo';
import BaseDialog from '../../shared/BaseDialog';
import UserSocialAssociation, {UserSocialAssociationProps} from '../UserSocialAssociation';

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
  website: {
    id: 'ui.userProfileInfo.website',
    defaultMessage: 'ui.userProfileInfo.website'
  },
  tags: {
    id: 'ui.userProfileInfo.website',
    defaultMessage: 'ui.userProfileInfo.website'
  },
  fieldLink: {
    id: 'ui.userProfileInfo.fieldLink',
    defaultMessage: 'ui.userProfileInfo.fieldLink'
  },
  fieldLinkFemale: {
    id: 'ui.userProfileInfo.fieldLink.female',
    defaultMessage: 'ui.userProfileInfo.fieldLink.female'
  },
  socialAssociations: {
    id: 'ui.userProfileInfo.socialAssociations',
    defaultMessage: 'ui.userProfileInfo.socialAssociations'
  }
});

const PREFIX = 'SCUserProfileInfo';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`,
  fieldLink: `${PREFIX}-field-link`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: theme.spacing(2),
  [`& .${classes.field}`]: {
    fontWeight: 'bold'
  },
  [`& .${classes.fieldLink}`]: {
    textDecoration: 'none'
  }
}));

export interface UserProfileInfoProps {
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * User fields to display in the profile
   * @default [real_name, date_joined, date_of_birth, website, description, bio]
   */
  fields?: SCUserProfileFields[];
  /**
   * Props to spread to user social association component
   * default {}
   */
  socialAssociationProps?: UserSocialAssociationProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 *
 > API documentation for the Community-JS User Profile Info component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileInfo} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileInfo` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileInfo-root|Styles applied to the root element.|
 |field|.SCUserProfileInfo-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserProfileInfo(inProps: UserProfileInfoProps): JSX.Element {
  // PROPS
  const props: UserProfileInfoProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, fields = [...DEFAULT_FIELDS], socialAssociationProps = {}, ...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const isMe = scUserContext.user && scUserContext.user.id === scUser?.id;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editField, setEditField] = useState<string>('');

  // INTL
  const intl = useIntl();
  const isIt = intl.locale === 'it';

  const renderFieldTranslation = (field) => {
    if (isIt) {
      switch (field) {
        case SCUserProfileFields.DATE_OF_BIRTH:
        case SCUserProfileFields.DESCRIPTION:
        case SCUserProfileFields.BIO:
          return intl.formatMessage(messages.fieldLinkFemale, {field: intl.formatMessage(messages[camelCase(field)]).toLowerCase()});
        case SCUserProfileFields.SOCIAL_ASSOCIATIONS:
          return intl.formatMessage(messages.socialAssociations);
        default:
          return intl.formatMessage(messages.fieldLink, {field: intl.formatMessage(messages[camelCase(field)]).toLowerCase()});
      }
    }
    if (field === SCUserProfileFields.SOCIAL_ASSOCIATIONS) {
      return intl.formatMessage(messages.socialAssociations, {field: intl.formatMessage(messages[camelCase(field)]).toLowerCase()});
    }
    return intl.formatMessage(messages.fieldLink, {field: intl.formatMessage(messages[camelCase(field)]).toLowerCase()});
  };

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const metadataDefinitions = useMemo(() => {
    if (scPreferences.preferences && SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS in scPreferences.preferences) {
      try {
        return JSON.parse(scPreferences.preferences[SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS].value);
      } catch (e) {
        Logger.error(SCOPE_SC_UI, 'Error on parse user metadata.');
        console.log(scPreferences.preferences[SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS]);
        return {};
      }
    }
    return null;
  }, [scPreferences.preferences]);

  // RENDER
  const renderField = (user, field) => {
    switch (field) {
      case SCUserProfileFields.DATE_JOINED:
      case SCUserProfileFields.DATE_OF_BIRTH:
        return `${intl.formatDate(user[field], {year: 'numeric', month: 'numeric', day: 'numeric'})}`;
      case SCUserProfileFields.TAGS:
        return (
          <Tags
            tags={user.tags.filter((t) => t.visible)}
            type={TagsComponentType.LIST}
            direction={'row'}
            TagChipProps={{clickable: false, disposable: false}}
          />
        );
      case SCUserProfileFields.SOCIAL_ASSOCIATIONS:
        return <UserSocialAssociation user={user} direction="row" ml={1} />;
      default:
        return user[field];
    }
  };

  const handleDialogOpening = (field) => {
    setEditField(field);
    setOpenDialog(true);
  };

  const renderFieldLink = (field) => {
    return (
      <Link component="button" variant="body2" onClick={() => handleDialogOpening(field)} className={classes.fieldLink}>
        {renderFieldTranslation(field)}
      </Link>
    );
  };

  const handleFieldUpdate = (f) => {
    setSCUser(Object.assign({}, scUser, f));
  };

  if (!scUser || !metadataDefinitions) {
    return <UserProfileInfoSkeleton />;
  }

  if (fields.length === 0) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={2}>
        {fields.map((field) => {
          if (scUser[field]) {
            if (field === SCUserProfileFields.TAGS) {
              return (
                <React.Fragment key={field}>
                  {scUser[field].length > 0 && (
                    <Grid item xs={12}>
                      {renderField(scUser, field)}
                    </Grid>
                  )}
                </React.Fragment>
              );
            }
            return (
              <Grid item xs={6} key={field}>
                <Typography variant="body2">
                  <span className={classes.field}>
                    {metadataDefinitions[field] ? metadataDefinitions[field].label : intl.formatMessage(messages[camelCase(field)])}:
                  </span>{' '}
                  {renderField(scUser, field)}
                </Typography>
              </Grid>
            );
          } else if (isMe) {
            if (field === SCUserProfileFields.SOCIAL_ASSOCIATIONS) {
              return (
                <React.Fragment key={field}>
                  <Grid item xs={6}>
                    <UserSocialAssociation
                      direction="row"
                      alignItems="center"
                      user={scUser}
                      children={
                        <Typography variant="body2" ml={2}>
                          {scUser?.ext_id ? renderFieldLink(field) : null}
                        </Typography>
                      }
                      {...socialAssociationProps}
                    />
                  </Grid>
                </React.Fragment>
              );
            }
            return (
              <Grid item xs={6} key={field}>
                <Typography variant="body2">
                  <span className={classes.field}>
                    {metadataDefinitions[field] ? metadataDefinitions[field].label : intl.formatMessage(messages[camelCase(field)])}:
                  </span>{' '}
                  {renderFieldLink(field)}
                </Typography>
              </Grid>
            );
          }
          if (field === SCUserProfileFields.SOCIAL_ASSOCIATIONS) {
            return <React.Fragment key={field}>{renderField(scUser, field)}</React.Fragment>;
          }
          return null;
        })}
      </Grid>
      {openDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.userProfileInfo.dialog.title" defaultMessage="ui.userProfileInfo.dialog.title" />}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          className={classNames(classes.root, className)}
          {...rest}>
          <PublicInfo
            editingField={editField}
            onEditSuccess={(f: {}) => handleFieldUpdate(f)}
            onAssociationCreate={socialAssociationProps?.onCreateAssociation}
            onAssociationDelete={socialAssociationProps?.onDeleteAssociation}
          />
        </BaseDialog>
      )}
    </Root>
  );
}
