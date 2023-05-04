export enum SCLegalPagePoliciesType {
  TERMS_AND_CONDITIONS = 'tec',
  PRIVACY = 'privacy'
}

/**
 * SCLegalPageType interface
 */
export interface SCLegalPageType {
  /**
   * Unique integer value identifying this page
   */
  id: number;
  /**
   * The name and version code for this page
   */
  name_and_version: string;
  /**
   * 	A css class representing the icon associated to this page
   */
  icon_class: string;
  /**
   * A label for the page in the menu
   */
  label: string;
  /**
   * An external url for this page (in alternative to the full body)
   */
  external_url: string;
  /**
   * 	A short html summary
   */
  html_summary: string;
  /**
   * 	The full html body for this page
   */
  html_body: string;
  /**
   * The extraction order of the page
   */
  order: number;
  /**
   * This page is valid from this date
   */
  valid_from: Date | string;
  /**
   * This page is valid till this date
   */
  valid_to: Date | string;
  /**
   * 	datetime of creation
   */
  created_at: Date | string;
  /**
   * The id of the creator of this page
   */
  created_by: number;
  /**
   * User ack
   */
  ack?: SCLegalPageAckType;
}

/**
 * SCLegalPageAckType interface
 */

export interface SCLegalPageAckType {
  /**
   * Unique integer value identifying this ack
   */
  id: number;
  /**
   * This policy has been accepted in this datetime
   */
  accepted_at: Date | string;
  /**
   * 	This policy has been refused in this datetime
   */
  not_accepted_at: Date | string;
  /**
   * The id of the policy page
   */
  custom_page: number;
  /**
   * 	The id of the user
   */
  user: number;
}
