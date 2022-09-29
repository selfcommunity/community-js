/**
 * SCPaginatedResponse Interface
 */

export interface SCPaginatedResponse<T = []> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
