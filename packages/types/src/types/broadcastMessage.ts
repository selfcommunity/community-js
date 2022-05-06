/**
 * Define the various types of banners
 */
export enum SCBroadcastMessageBannerType {
  HTML = 'html_banner',
  NOTIFICATION = 'notification_banner',
}

export interface SCBannerType {
  /**
   * The type of the banner, based on it the behaviour of the render component must be different
   */
  type_banner: SCBroadcastMessageBannerType;

  /**
   * The html to insert into the DOM
   * This field is used when type_banner is html_banner
   */
  html?: string;

  /**
   * The title of the banner
   */
  title?: string;

  /**
   * The text of the banner
   */
  body_text?: string;

  /**
   * The text of the link associated to the banner
   */
  link_text?: string;
  /**
   * The action link of the banner
   */
  link?: string;
  /**
   * The image url to insert into the banner
   */
  image?: string;
  /**
   * The date the Banner was created
   */
  added_at: Date;
  /**
   * If true tell to open the banner in new tab
   */
  open_in_new_tab: boolean;
}

/**
 * Interface SCBroadcastMessageType.
 * Broadcast Message object
 */
export interface SCBroadcastMessageType {
  /**
   * The ID of the category.
   */
  id: number;

  /**
   * The Banner associated to the Broadcast messages
   */
  banner: SCBannerType;

  /**
   * The date the BroadcastMessage was added
   */
  added_at: Date;

  /**
   * The date the BroadcastMessage was disposed
   */
  disposed_at: Date | null;

  /**
   * The date the BroadcastMessage was viewed the first time
   */
  viewed_at: Date | null;
}
