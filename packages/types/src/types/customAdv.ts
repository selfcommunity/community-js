export enum SCCustomAdvPosition {
  POSITION_BELOW_TOPBAR = 'BELOW_TOPBAR',
  POSITION_BELOW_FEED_OBJECT = 'BELOW_THE_POST',
  POSITION_ABOVE_FOOTER_BAR = 'ABOVE_FOOTER_BAR',
  POSITION_FOOTER_STICKY = 'FOOTER_STICKY',
  POSITION_IN_COMMENTS = 'IN_POST_COMMENTS',
  POSITION_RELATED_POSTS_COLUMN = 'RELATED_POSTS_COLUMN',
  POSITION_FEED_SIDEBAR = 'TOOLS_COLUMN',
  POSITION_FEED = 'IN_STREAM'
}

export interface SCCustomAdvType {
  /**
   * Unique integer value identifying this adv
   */
  id: number;

  /**
   * A string code representing the display position of the adv
   */
  position: SCCustomAdvPosition;

  /**
   * The title of the adv
   */
  title: string | null;

  /**
   * The link/url of the adv
   */
  link: string | null;

  /**
   * An image banner for the adv
   */
  image: string | null;

  /**
   * Html/js embeddable code
   */
  embed_code: string | null;

  /**
   * A flag to activate or deactivate this adv
   */
  active: boolean;

  /**
   * datetime of creation
   */
  created_at: string;

  /**
   * last modify datetime
   */
  lastmod_datetime: string;

  /**
   * The id of the category connected to this adv
   */
  category: number | null;
}
