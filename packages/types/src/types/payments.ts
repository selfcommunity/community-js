export interface SCContentProduct {
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
  prices: SCProductPrice[];
}

export interface SCProductPrice {
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
  currency?: SCProductPriceType;

  /**
   * Recurring interval
   */
  recurring_interval?: string;
}

/**
 * SCProductPriceType enum
 */
export enum SCProductPriceType {
  EUR = 'EUR'
}

/**
 * Paywalls Content types
 */
export enum SCContentType {
  EVENT = 'event',
  COURSE = 'course',
  CATEGORY = 'category',
  GROUP = 'group'
}

export interface SCPurchasableContent {
	id: number | string;
  paywalls: SCContentProduct[];
}

export interface SCCheckoutSession {
  /**
   * Client secret
   */
  client_secret: string;
}
