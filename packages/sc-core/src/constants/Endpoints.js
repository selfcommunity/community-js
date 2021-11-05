import {urlReplacer} from '../utils/url';

export default {
  /**
   * User Endpoints
   */
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET',
  },
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET',
  },
  UserSuggestion: {
    url: urlReplacer('/api/v2/suggestion/user/'),
    method: 'GET',
  },
  /**
   * Preferences Endpoints
   */
  Preferences: {
    url: urlReplacer('/api/v2/dynamic_preference/'),
    method: 'GET',
  },
};
