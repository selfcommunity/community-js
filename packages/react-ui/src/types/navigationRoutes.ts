/**
 * Interface SCNavigationRoutesType
 */
export interface SCNavigationRoutesType {
  /**
   * Homepage url
   */
  home?: string;
  /**
   * User profile page url
   */
  profile?: string;
  /**
   * User categories page url
   */
  interests?: string;
  /**
   * User followings page url
   */
  followings?: string;
  /**
   * User connections page url
   */
  connections?: string;
  /**
   * Create contribute page url
   */
  create?: string;
  /**
   * User notifications page url
   */
  notifications?: string;
  /**
   * User followers page url
   */
  followers?: string;
  /**
   * User posts page url
   */
  posts?: string;
  /**
   * User comments page url
   */
  comments?: string;
  /**
   * User loyalty program page url
   */
  loyalty?: string;
  /**
   * User followed posts page url
   */
  followedPosts?: string;
  /**
   * User followed discussions page url
   */
  followedDiscussions?: string;
  /**
   * People suggestion page url
   */
  peopleSuggestion?: string;
  /**
   * User private messages page url
   */
  messages?: string;
  /**
   * Community tour page url
   */
  communityTour?: string;
  /**
   * User settings page url
   */
  settings?: string;
  /**
   * Explore page url
   */
  explore?: string;
  /**
   * Login function
   */
  login?: () => void;
  /**
   * Logout function
   */
  logout?: () => void;
  /**
   * Register page url
   */
  register?: string;
  /**
   * Search page url
   */
  search?: string;
}
