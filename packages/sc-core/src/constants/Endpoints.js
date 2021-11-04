import {urlReplacer} from '../utils/url';

export default {
  // Interests
  Category: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'GET',
  },
  CategoryFollowed: {
    url: urlReplacer('/api/v2/category/followed/'),
    method: 'GET',
  },
  CategoryTrendingFeed: {
    url: urlReplacer('/api/v2/category/$(id)/feed/trending/'),
    method: 'GET',
  },
  CategoryTrendingPeople: {
    url: urlReplacer('/api/v2/category/$(id)/followers/trending/'),
    method: 'GET',
  },
  // Users
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET',
  },
  UserFollowers: {
    url: urlReplacer('/api/v2/user/$(id)/followers/'),
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
  CategorySuggestion: {
    url: urlReplacer('/api/v2/suggestion/category/'),
    method: 'GET',
  },
};
