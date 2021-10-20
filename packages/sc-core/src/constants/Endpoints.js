import {urlReplacer} from '../utils/url';

export default {
  // Users
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET',
  },
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET',
  },
  // Preferences
  Preferences: {
    url: urlReplacer('/api/v2/dynamic_preference/'),
    method: 'GET',
  },
  UserSuggestion: {
    url: urlReplacer('/api/v2/suggestion/user/'),
    method: 'GET',
  },
};
