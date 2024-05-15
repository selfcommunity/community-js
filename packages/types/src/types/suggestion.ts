/**
 * User status
 */
import {SCCategoryType} from './category';
import {SCUserType} from './user';
import {SCGroupType} from './group';

export enum SuggestionType {
  USER = 'user',
  CATEGORY = 'category',
  GROUP = 'group'
}

/**
 * Interface SCSuggestionType.
 * Suggestion Schema.
 */
export interface SCSuggestionType {
  type?: SuggestionType;
  score?: number;
  category?: SCCategoryType;
  user?: SCUserType;
  group?: SCGroupType;
}
