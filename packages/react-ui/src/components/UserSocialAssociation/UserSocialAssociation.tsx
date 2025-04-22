import React, {useEffect, useMemo} from 'react';
import {Button, Paper, Stack, StackProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {SCUserProviderAssociationType, SCUserType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, useSCFetchUser, useSCFetchUserProviders, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserSocialAssociations} from '../../types';
import {PROVIDER_ICONS_CONTAINED} from '../../constants/SocialShare';

const messages = defineMessages({
  provider: {
    id: 'ui.userSocialAssociation.provider',
    defaultMessage: 'ui.userSocialAssociation.provider'
  },
  actions: {
    id: 'ui.userSocialAssociation.actions',
    defaultMessage: 'ui.userSocialAssociation.actions'
  },
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
  field: `${PREFIX}-field`,
  providerTable: `${PREFIX}-provider-table`,
  providerIcon: `${PREFIX}-provider-icon`,
  providerName: `${PREFIX}-provider-name`,
  providerAction: `${PREFIX}-provider-action`
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
  onDeleteAssociation?: (provider: SCUserProviderAssociationType) => any;
  /**
   * children
   * @default null
   */
  children?: React.ReactNode;
  /**
   * If present, providers list must be updated
   */
  deletingProvider?: SCUserProviderAssociationType;
}

/**
 * > API documentation for the Community-JS User Social Association component. Learn about the available props and the CSS API.

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
    children = null,
    deletingProvider = null,
    ...rest
  } = props;
  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});
  const {scUserProviders, setSCUserProviders} = useSCFetchUserProviders({id: userId || scUser.id, providers});
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
  const _providers: {[p: string]: SCUserProviderAssociationType} = useMemo(() => {
    return scUserProviders
      .map((provider: SCUserProviderAssociationType) => ({[provider.provider]: provider}))
      .reduce((prev, provider) => Object.assign(prev, provider), {});
  }, [scUserProviders]);
  const providersEnabled = Object.values<string>(SCUserSocialAssociations).filter((p) => preferences[`providers.${p}_signin_enabled`]);
  const providersToLink = providersEnabled?.filter((p) => !_providers[p]?.provider && !_providers[p]?.ext_id);
  const providersLinked = Object.values(_providers).filter((p) => providersEnabled.includes(p.provider));
  /**
   * Updates providers list onDelete association
   */
  useEffect(() => {
    if (deletingProvider) {
      const updatedProviders = scUserProviders.filter((p) => p.provider !== deletingProvider.provider);
      setSCUserProviders(updatedProviders);
    }
  }, [deletingProvider]);
  /**
   * Renders social association block
   */
  if (!providersEnabled) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest} direction="column">
      {providersLinked.length !== 0 || (providersToLink.length !== 0 && onCreateAssociation) ? children : null}
      <TableContainer component={Paper} className={classes.providerTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{width: '60%'}}>{intl.formatMessage(messages.provider)}</TableCell>
              <TableCell align="left">{intl.formatMessage(messages.actions)}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providersToLink.length !== 0 && onCreateAssociation && (
              <>
                {providersToLink.map((p: string, index) => (
                  <TableRow key={index}>
                    <TableCell scope="row">
                      <img src={PROVIDER_ICONS_CONTAINED[`${p}`]} width="30" height="30" className={classes.providerIcon} alt={p} />
                      <span className={classes.providerName}>{p}</span>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        className={classes.providerAction}
                        color="primary"
                        onClick={onCreateAssociation ? () => onCreateAssociation(p) : null}
                        size="small">
                        {intl.formatMessage(messages.socialAdd)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {providersLinked.length !== 0 && (
              <>
                {providersLinked.map((p: SCUserProviderAssociationType, index) => (
                  <TableRow key={index} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                    <TableCell scope="row">
                      <img
                        src={PROVIDER_ICONS_CONTAINED[`${p.provider}`]}
                        width="30"
                        height="30"
                        className={classes.providerIcon}
                        alt={p.provider}
                      />
                      <span className={classes.providerName}>{p.provider}</span>
                    </TableCell>
                    <TableCell align="left">
                      <Button variant="outlined" className={classes.providerAction} onClick={() => onDeleteAssociation(p)} size="small">
                        {intl.formatMessage(messages.socialRemove)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
