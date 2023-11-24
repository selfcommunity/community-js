/**
 * Interface SCContributionLocation.
 * Location Schema.
 */
export interface SCContributionLocation {
  /**
   * location
   */
  location: string;

  /**
   * Latitude
   */
  lat?: number;

  /**
   * Longitude
   */
  lng?: number;
}

/**
 * Interface SCLocalityType.
 * Locality Schema.
 */
export interface SCLocalityType {
  /**
   * full_address
   */
  full_address: string;

  /**
   * country
   */
  country: string;

  /**
   * Latitude
   */
  lat: number;

  /**
   * Longitude
   */
  lng: number;

  /**
   * postal_code
   */
  postal_code: string;

  /**
   * province
   */
  province: string;

  /**
   * province_short
   */
  province_short: string;

  /**
   * region
   */
  region?: string;

  /**
   * town
   */
  town: string;
}
