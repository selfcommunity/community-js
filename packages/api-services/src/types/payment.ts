import {BaseGetParams} from './baseParams';
import {SCContentType} from '@selfcommunity/types';

/**
 * PaymentParams interface.
 */
export interface ContentProductsParams extends BaseGetParams {
  /**
   * Content id
   */
  content_id: number | string;
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
  price_id: string;
}
