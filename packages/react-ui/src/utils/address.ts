import {countries} from '../constants/Country';

/**
 * Get country by code
 * @param code
 */
export function getCountryLabelByCode(code: string): string {
  return countries.filter((c) => c.code === code)[0].label;
}

/**
 * Select option in countries
 * @param code
 */
export const getCountryOption = (code: string | null | undefined) => {
  if (!code) {
    return null;
  }
  const _filtered = countries.filter((country) => country.code === code);
  return _filtered.length > 0 ? _filtered[0] : null;
};
