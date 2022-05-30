import {SCAuthTokenType} from './auth';
/**
 * SCPlatformType interface
 */
export interface SCPlatformType {
  platform_url: string;
  token_details: SCAuthTokenType;
}
