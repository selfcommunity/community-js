export interface SCCustomerBillingInfo {
  /**
   * Full name of the customer for billing purposes.
   */
  name?: string;

  /**
   * Customer's phone number.
   */
  phone?: string;

  /**
   * First line of the billing address.
   */
  address_line1?: string;

  /**
   * Second line of the billing address (optional).
   */
  address_line2?: string;

  /**
   * Postal code of the billing address.
   */
  address_postal_code?: string;

  /**
   * City of the billing address.
   */
  address_city?: string;

  /**
   * State or province of the billing address.
   */
  address_state?: string;

  /**
   * Country of the billing address.
   */
  address_country?: SCCountryType;

  /**
   * Customer's tax code or personal tax identification number.
   */
  tax_code?: string;

  /**
   * Indicates whether the billing information is for a business entity.
   */
  isBusiness?: boolean;

  /**
   * Additional tax ID data, used for business identification.
   */
  tax_id_data?: {value: string};

  /**
   * Status of the tax ID validation process.
   */
  taxIdValidationStatus?: string;

  /**
   * SDI (Sistema di Interscambio) code for electronic invoicing in Italy.
   */
  sdi?: string;

  /**
   * Certified email (PEC) address for electronic invoicing in Italy.
   */
  pec?: string;
}

export interface SCCountryType {
  /**
   * ISO 3166-1 alpha-2 country code (e.g., "IT" for Italy).
   */
  code: string;

  /**
   * Human-readable country name (e.g., "Italy").
   */
  label: string;

  /**
   * International dialing code for the country (optional).
   */
  phone?: string;

  /**
   * Type of tax applicable in the country (e.g., "VAT").
   */
  taxType?: string;

  /**
   * Identifier for the tax rate used in this country.
   */
  taxRateId?: string;

  /**
   * Tax rate percentage applied in the country (e.g., 22 for 22% VAT).
   */
  taxRatePercentage?: number;
}
