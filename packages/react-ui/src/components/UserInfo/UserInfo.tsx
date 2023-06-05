import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {camelCase, Logger} from '@selfcommunity/utils';
import {SCMetadataType, SCUserType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, useSCFetchUser, useSCPreferences} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import UserInfoSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Tags, {TagsComponentType} from '../../shared/Tags';

const messages = defineMessages({
  realName: {
    id: 'ui.userInfo.realName',
    defaultMessage: 'ui.userInfo.realName'
  },
  dateJoined: {
    id: 'ui.userInfo.dateJoined',
    defaultMessage: 'ui.userInfo.dateJoined'
  },
  bio: {
    id: 'ui.userInfo.bio',
    defaultMessage: 'ui.userInfo.bio'
  },
  location: {
    id: 'ui.userInfo.location',
    defaultMessage: 'ui.userInfo.location'
  },
  dateOfBirth: {
    id: 'ui.userInfo.dateOfBirth',
    defaultMessage: 'ui.userInfo.dateOfBirth'
  },
  description: {
    id: 'ui.userInfo.description',
    defaultMessage: 'ui.userInfo.description'
  },
  gender: {
    id: 'ui.userInfo.gender',
    defaultMessage: 'ui.userInfo.gender'
  },
  website: {
    id: 'ui.userInfo.website',
    defaultMessage: 'ui.userInfo.website'
  },
  tags: {
    id: 'ui.userInfo.website',
    defaultMessage: 'ui.userInfo.website'
  },
  fieldLink: {
    id: 'ui.userInfo.fieldLink',
    defaultMessage: 'ui.userInfo.fieldLink'
  }
});

const PREFIX = 'SCUserInfo';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface UserInfoProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

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
 > API documentation for the Community-JS User Info component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserInfo} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserInfo` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserInfo-root|Styles applied to the root element.|
 |field|.SCUserInfo-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserInfo(inProps: UserInfoProps): JSX.Element {
  // PROPS
  const props: UserInfoProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // STATE
  const {scUser} = useSCFetchUser({id: userId, user});

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

  // FIELDS
  const _fields: string[] = [...fields, ...Object.keys(metadataDefinitions)];

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
    return <UserInfoSkeleton />;
  }

  if (_fields.length === 0) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {_fields.map((field) => {
        if (scUser[field]) {
          if (field === SCUserProfileFields.TAGS) {
            return scUser[field].length > 0 ? (
              <Box key={field} className={classes.field}>
                {renderField(scUser, field)}
              </Box>
            ) : null;
          }
          return (
            <Box key={field} className={classes.field}>
              <Typography variant="h6">
                {metadataDefinitions[field] ? metadataDefinitions[field].label : intl.formatMessage(messages[camelCase(field)])}
              </Typography>
              <Typography variant="body2">{renderField(scUser, field)}</Typography>
            </Box>
          );
        }
        return null;
      })}
    </Root>
  );
}
