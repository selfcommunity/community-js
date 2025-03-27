import {SCUserType} from './user';
import {SCEventType} from './event';
import {SCCourseType} from './course';
import {SCGroupType} from './group';
import {SCCategoryType} from './category';
import {SCCommunityType} from './community';

export interface SCPaywall {
  /**
   * Id product
   */
  id: number;
	/**
	 * Content type
	 */
	content_type: SCContentType;
	/**
	 * Content event
	 */
  event?: SCEventType;
  /**
   * Content course
   */
  course?: SCCourseType;
  /**
   * Content group
   */
  group?: SCGroupType;
  /**
   * Content category
   */
  category?: SCCategoryType;
  /**
   * Content community
   */
  community?: SCCommunityType;

  /**
   * Active or not
   */
  active?: boolean;
  /**
   * Payment product
   */
  payment_product: SCPaymentProduct;
}

export interface SCPaymentProduct {
  /**
   * Id product
   */
  id: number;

  /**
   * Product name
   */
  name: string;

  /**
   * Description name
   */
  description?: string;

  /**
   * Active or not
   */
  active?: boolean;

  /**
   * Stripe product id
   */
  stripe_product_id: string;

  /**
   * Stripe default price id
   */
  stripe_default_price_id?: string;

  /**
   * Stripe prices
   */
  payment_prices: SCPaymentPrice[];
}

export enum SCPaymentProductTemplateType {
  DETAIL = 'detail'
}

export interface SCPaymentPrice {
  /**
   * Id product
   */
  id: number;

  /**
   * Description name
   */
  description?: string;

  /**
   * Active or not
   */
  active?: boolean;

  /**
   * Stripe price id
   */
  stripe_price_id: string;

  /**
   * Price
   */
  unit_amount?: number;

  /**
   * Currency
   */
  currency?: SCPaymentPriceCurrencyType;

  /**
   * Recurring interval
   */
  recurring_interval?: string;

  /**
   * Payment product id associated
   */
  payment_product_id?: number;

  /**
   * Payment product associated
   */
  payment_product?: SCPaymentProduct;
}

/**
 * SCCurrencyPriceType enum
 */
export enum SCPaymentPriceCurrencyType {
  EUR = 'EUR'
}

/**
 * Paywalls Content types
 */
export enum SCContentType {
  EVENT = 'event',
  COURSE = 'course',
  CATEGORY = 'category',
  GROUP = 'group',
  COMMUNITY = 'community'
}

export interface SCPurchasableContent {
  id?: number;
  payment_order?: SCPaymentOrder;
  paywalls?: SCPaymentProduct[];
	product_ids?: number[];
}

export interface SCCheckoutSessionDetail {
  status?: string;
  metadata?: {content_id: string; content_type: SCContentType};
}

export interface SCCheckoutSessionComplete {
  id: number;
  content_id: number;
  content_type: SCContentType;
  event?: SCEventType;
  course?: SCCourseType;
  group?: SCGroupType;
  category?: SCCategoryType;
  created_at: Date;
  expire_at: Date;
  payment_price: SCPaymentPrice;
  user: SCUserType;
}

export interface SCCheckoutSession {
  /**
   * Session id
   */
  id?: string;
  /**
   * Client secret
   */
  client_secret: string;
}

export enum SCCheckoutSessionStatus {
  COMPLETE = 'complete',
  OPEN = 'open'
}

export enum SCCheckoutSessionUIMode {
  HOSTED = 'hosted',
  EMBEDDED = 'embedded'
}

export interface SCPaymentOrder {
  /**
   * Order id
   */
  id: number;
  /**
   * Price
   */
  payment_price?: SCPaymentPrice;
  /**
   * Content type
   */
  content_type: SCContentType;
  /**
   * Content event
   */
  event?: SCEventType;
  /**
   * Content course
   */
  course?: SCCourseType;
  /**
   * Content group
   */
  group?: SCGroupType;
  /**
   * Content category
   */
  category?: SCCategoryType;
  /**
   * Content community
   */
  community?: SCCommunityType;
  /**
   * Created at
   */
  created_at?: Date;
  /**
   * Expired at
   */
  expire_at?: Date;
}

export interface SCPaymentsCustomerPortalSession {
  url: string;
}
