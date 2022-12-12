import {SCUserProfileFields, SCUserProfileSettings} from '../types';

export const DEFAULT_FIELDS = [
  SCUserProfileFields.TAGS,
  SCUserProfileFields.REAL_NAME,
  SCUserProfileFields.DATE_JOINED,
  SCUserProfileFields.DATE_OF_BIRTH,
  SCUserProfileFields.DESCRIPTION,
  SCUserProfileFields.WEBSITE,
  SCUserProfileFields.BIO
];

export const DEFAULT_SETTINGS = [SCUserProfileSettings.NOTIFICATION, SCUserProfileSettings.INTERACTION, SCUserProfileSettings.PRIVATE_MESSAGE];
