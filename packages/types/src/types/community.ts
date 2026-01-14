import {SCPaymentOrder, SCPaymentProduct, SCPurchasableContent} from './payment';

export interface SCCommunityType extends SCPurchasableContent {
  /**
   * Id community
   */
  id: number;
  /**
   * Payment Order
   */
  payment_order?: SCPaymentOrder;
  /**
   * Paywalls
   */
  paywalls?: SCPaymentProduct[];
  /**
   * User paywall community status
   */
  paywall_community_passed?: boolean;
}
