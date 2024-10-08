// integrations
export const INTEGRATIONS_OPTION = 'integrations';
export const INTEGRATIONS_OPENAI_OPTION = 'openai';
export const INTEGRATIONS_OPENAI_SECRETKEY_OPTION = 'secretKey';
export const INTEGRATIONS_GEOCODING_OPTION = 'geocoding';
export const INTEGRATIONS_GEOCODING_APIKEY_OPTION = 'apiKey';

export const DEFAULT_INTEGRATIONS_OPTION = {
  [INTEGRATIONS_OPENAI_OPTION]: {
    [INTEGRATIONS_OPENAI_SECRETKEY_OPTION]: null,
  },
  [INTEGRATIONS_GEOCODING_OPTION]: {
    [INTEGRATIONS_GEOCODING_APIKEY_OPTION]: null,
  },
};
