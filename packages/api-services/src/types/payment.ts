import {BaseGetParams, BaseSearchParams} from './baseParams';
import {SCCheckoutSessionUIMode, SCContentType} from '@selfcommunity/types';

/**
 * PaymentParams interface.
 */
export interface PaymentProductsParams extends BaseGetParams {
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
  /**
   *	Success url
   */
  success_url?: string;
  /**
   *	Session UI mode
   */
  ui_mode?: SCCheckoutSessionUIMode;
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

/**
 * PaymentContentStatusParams interface.
 */
export interface PaymentContentStatusParams extends BaseGetParams {
  /**
   * Content id
   */
  content_id?: number | string;
  /**
   * Content type
   */
  content_type?: SCContentType;
}

/**
 * PaymentOrderParams interface.
 */
export interface PaymentOrderParams extends BaseSearchParams {
  /**
   * Ordering
   */
  ordering?: string;
}
