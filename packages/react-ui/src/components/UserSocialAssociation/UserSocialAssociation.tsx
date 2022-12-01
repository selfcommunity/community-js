import React, {useEffect, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, IconButton, Stack, StackProps, Typography} from '@mui/material';
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
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import {SCUserSocialAssociations} from '@selfcommunity/react-ui';

const messages = defineMessages({
  socialAdd: {
    id: 'ui.userSocialAssociation.add',
    defaultMessage: 'ui.userSocialAssociation.add'
  },
  socialRemove: {
    id: 'ui.userSocialAssociation.remove',
    defaultMessage: 'ui.userSocialAssociation.remove'
  }
});

const PREFIX = 'SCUserSocialAssociation';

const classes = {
  root: `${PREFIX}-root`,
  editView: `${PREFIX}-edit-view`,
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
  /**
   * If true, renders in a different way
   * @default false
   */
  isEditView?: boolean;
  /**
   * Handler for deleting an existing association
   * @default null
   */
  onDeleteAssociation?: (provider: string) => any;
  /**
   * children
   * @default null
   */
  children?: React.ReactNode;
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
  const {
    className = null,
    userId = null,
    user = null,
    providers = null,
    onCreateAssociation = null,
    onDeleteAssociation = null,
    isEditView = false,
    children = null,
    ...rest
  } = props;
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
    if (_providers[name]?.profile_url && _providers[name]?.show_in_profile) {
      return {component: Link, to: _providers[name]?.profile_url, color: 'primary', target: '_blank'};
    } else if (_providers[name]) {
      return {color: 'primary'};
    } else if (isMe && onCreateAssociation) {
      return {onClick: onCreateAssociation(name)};
    } else {
      return {disabled: true};
    }
  };
  const providersEnabled = Object.values(SCUserSocialAssociations).filter((p) => preferences[`providers.${p}_signin_enabled`]);
  const providersList = (op?: string) => {
    return providersEnabled?.filter((p) => (op === '!' ? !_providers[p]?.profile_url : _providers[p]?.profile_url));
  };

  // RENDER
  if (isEditView && providersEnabled) {
    return (
      <Root className={classNames(classes.editView, className)} {...rest} direction="column">
        {providersList('!').length !== 0 && (
          <Box>
            <Typography variant="body2"> {intl.formatMessage(messages.socialAdd)}</Typography>
            {providersList('!').map((p: string, index) => (
              <React.Fragment key={index}>
                <IconButton onClick={onCreateAssociation ? () => onCreateAssociation(p) : null}>
                  <Icon>{p}</Icon>
                </IconButton>
              </React.Fragment>
            ))}
          </Box>
        )}
        {providersList().length !== 0 && (
          <Box>
            <Typography variant="body2"> {intl.formatMessage(messages.socialRemove)}</Typography>
            {providersList().map((p: string, index) => (
              <React.Fragment key={index}>
                <IconButton color="primary" onClick={() => onDeleteAssociation(p)}>
                  <Icon>{p}</Icon>
                </IconButton>
              </React.Fragment>
            ))}
          </Box>
        )}
      </Root>
    );
  }
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
      {children}
    </Root>
  );
}
