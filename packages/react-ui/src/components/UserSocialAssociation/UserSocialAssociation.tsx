import React, {useCallback, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {IconButton, IconButtonProps, Stack, StackProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {SCUserProviderAssociationType, SCUserType} from '@selfcommunity/types';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchUser,
  useSCFetchUserProviders,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import { SCUserSocialAssociations } from '@selfcommunity/react-ui';

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

const PREFIX = 'SCUserSocialAssociation';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const PREFERENCES = [
  SCPreferences.PROVIDERS_FACEBOOK_SIGNIN_ENABLED,
  SCPreferences.PROVIDERS_GOOGLE_SIGNIN_ENABLED,
  SCPreferences.PROVIDERS_TWITTER_SIGNIN_ENABLED,
  SCPreferences.PROVIDERS_LINKEDIN_SIGNIN_ENABLED
];

export interface UserSocialAssociationProps extends StackProps {
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
   * Providers association related to the given user
   * @default null
   */
  providers?: SCUserProviderAssociationType[];

  /**
   * Handler for creating a new provider association
   * @default null
   */
  onCreateAssociation?: (provider: string) => any;
}
/**
 *
 > API documentation for the Community-JS User Social Association component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserSocialAssociation} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserSocialAssociation` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSocialAssociation-root|Styles applied to the root element.|
 |field|.SCUserSocialAssociation-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserSocialAssociation(inProps: UserSocialAssociationProps): JSX.Element {
  // PROPS
  const props: UserSocialAssociationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, providers = null, onCreateAssociation = null, ...rest} = props;

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();
  const {scUser} = useSCFetchUser({id: userId, user});
  const {scUserProviders} = useSCFetchUserProviders({id: userId || scUser.id, providers});

  // INTL
  const intl = useIntl();

  // Compute preferences
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // MEMO PROVIDERS
  const isMe = useMemo(() => scUserContext.user?.id === scUser?.id, [scUserContext.user, scUser]);
  const _providers: {[p: string]: SCUserProviderAssociationType} = useMemo(() => {
    return scUserProviders
      .map((provider: SCUserProviderAssociationType) => ({[provider.provider]: provider}))
      .reduce((prev, provider) => Object.assign(prev, provider), {});
  }, [scUserProviders]);

  const getProviderButtonProps = (name: SCUserSocialAssociations): any => {
    if (_providers[name]?.profile_url) {
      return {component: Link, to: _providers[name]?.profile_url, color: 'primary', target: '_blank'};
    } else if (_providers[name]) {
      return {color: 'primary'};
    } else if (isMe && onCreateAssociation) {
      return {onClick: onCreateAssociation(name)};
    } else {
      return {disabled: true};
    }
  };

  // RENDER

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {preferences[SCPreferences.PROVIDERS_FACEBOOK_SIGNIN_ENABLED] && (
        <IconButton {...getProviderButtonProps(SCUserSocialAssociations.FACEBOOK)}>
          <Icon>facebook</Icon>
        </IconButton>
      )}
      {preferences[SCPreferences.PROVIDERS_GOOGLE_SIGNIN_ENABLED] && (
        <IconButton {...getProviderButtonProps(SCUserSocialAssociations.GOOGLE)}>
          <Icon>google</Icon>
        </IconButton>
      )}
      {preferences[SCPreferences.PROVIDERS_TWITTER_SIGNIN_ENABLED] && (
        <IconButton {...getProviderButtonProps(SCUserSocialAssociations.TWITTER)}>
          <Icon>twitter</Icon>
        </IconButton>
      )}
      {preferences[SCPreferences.PROVIDERS_LINKEDIN_SIGNIN_ENABLED] && (
        <IconButton {...getProviderButtonProps(SCUserSocialAssociations.LINKEDIN)}>
          <Icon>linkedin</Icon>
        </IconButton>
      )}
    </Root>
  );
}
