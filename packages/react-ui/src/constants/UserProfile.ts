import {SCUserProfileFields, SCUserProfileSettings} from '../types';

export const DEFAULT_FIELDS = [
  SCUserProfileFields.REAL_NAME,
  SCUserProfileFields.DATE_OF_BIRTH,
  SCUserProfileFields.BIO,
  SCUserProfileFields.WEBSITE,
  SCUserProfileFields.DESCRIPTION
];

export const DEFAULT_SETTINGS = [SCUserProfileSettings.NOTIFICATION, SCUserProfileSettings.INTERACTION, SCUserProfileSettings.PRIVATE_MESSAGE];
