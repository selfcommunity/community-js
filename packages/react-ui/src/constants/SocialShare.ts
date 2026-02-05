import {
  GoogleIconContained,
  LinkedinIconContained,
  TwitterIconContained,
  FacebookIconContained,
  KeycloakIconContained,
  EntraIdIconContained,
  GoogleIconOutlined,
  LinkedinIconOutlined,
  TwitterIconOutlined,
  FacebookIconOutlined,
  KeycloakIconOutlined,
  EntraIdIconOutlined
} from '@selfcommunity/react-theme-default';

/**
 * Social media urls for contribute share
 */
export const FACEBOOK_SHARE = 'https://www.facebook.com/sharer.php?u=';
export const X_SHARE = 'https://x.com/intent/tweet?url=';
export const LINKEDIN_SHARE = 'https://www.linkedin.com/sharing/share-offsite/?url=';

export const PROVIDER_ICONS_CONTAINED = {
  facebook: FacebookIconContained,
  twitter: TwitterIconContained,
  linkedin: LinkedinIconContained,
  google: GoogleIconContained,
  keycloak: KeycloakIconContained,
  entraid: EntraIdIconContained
};

export const PROVIDER_ICONS_OUTLINED = {
  facebook: FacebookIconOutlined,
  twitter: TwitterIconOutlined,
  linkedin: LinkedinIconOutlined,
  google: GoogleIconOutlined,
  keycloak: KeycloakIconOutlined,
  entraid: EntraIdIconOutlined
};

export const PROVIDER_ENTRAID_ALTERNATIVE_NAME = 'azure-ad';
