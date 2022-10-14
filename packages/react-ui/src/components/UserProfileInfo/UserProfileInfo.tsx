import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {camelCase, Logger} from '@selfcommunity/utils';
import {SCUserType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, useSCFetchUser, useSCPreferences} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import UserProfileInfoSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Tags, {TagsComponentType} from '../../shared/Tags';

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
  }
});

const PREFIX = 'SCUserProfileInfo';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: theme.spacing(2),
  [`& .${classes.field}`]: {
    fontWeight: 'bold'
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
  const {className = null, userId = null, user = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // INTL
  const intl = useIntl();

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
      default:
        return user[field];
    }
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
          }
          return null;
        })}
      </Grid>
    </Root>
  );
}
