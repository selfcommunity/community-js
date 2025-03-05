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
  GROUP = 'group'
}

export interface SCPurchasableContent {
  id?: number;
  paywalls?: SCPaymentProduct[];
}

export interface SCCheckoutSessionDetail {
  status?: string;
  metadata?: {content_id: string; content_type: SCContentType};
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
