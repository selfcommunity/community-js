// integrations
export const INTEGRATIONS_OPTION = 'integrations';
export const INTEGRATIONS_OPENAI_OPTION = 'openai';
export const INTEGRATIONS_OPENAI_SECRETKEY_OPTION = 'secretKey';

export const DEFAULT_INTEGRATIONS_OPTION = {
  [INTEGRATIONS_OPENAI_OPTION]: {
    [INTEGRATIONS_OPENAI_SECRETKEY_OPTION]: null,
  },
};
