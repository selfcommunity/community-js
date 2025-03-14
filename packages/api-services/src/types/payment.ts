import {BaseGetParams} from './baseParams';
import {SCContentType} from '@selfcommunity/types';

/**
 * PaymentParams interface.
 */
export interface ContentProductsParams extends BaseGetParams {
  /**
   * Content id
   */
  id?: number | string;
  /**
   * Content id
   */
  content_id?: number | string;
  /**
   * Content type
   */
  content_type?: SCContentType;
}

export interface CheckoutCreateSessionParams {
  /**
   * Content id
   */
  content_id: number;
  /**
   * Content type
   */
  content_type: SCContentType;
  /**
   * Price id
   */
  payment_price_id: number;
  /**
   *	Return url
   */
  return_url?: string;
}

export interface CheckoutSessionParams {
  /**
   *	Session Id
   */
  session_id: string;
}

export interface CustomerPortalCreateSessionParams {
  /**
   *	Return url
   */
  return_url?: string;
}
