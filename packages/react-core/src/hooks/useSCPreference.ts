import {useMemo} from 'react';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';

/**
 * Represents a user preference or configuration value that can hold data
 * of any type. It allows for arbitrary additional properties.
 *
 * @template T - The type of the primary `value` property. Defaults to `any`.
 *
 * @property {T} value - The main value of the preference.
 * @property {any} [key: string] - Additional custom metadata or properties associated with the preference.
 */
interface PreferenceValue<T = any> {
  value: T;
  [key: string]: any;
}

/**
 * Custom hook to recover a given preference.
 * @param preferenceKey - full preference key (e.g., 'section.name')
 * @param defaultValue - default returned value
 * @returns the preference value or undefined/defaultValue if doesn't exist
 *
 * Ex.
 * const customValue = useSCPreference&lt;string&gt;(SCPreferences.CUSTOM_SETTING);
 * const numericValue = useSCPreference&lt;number&gt;(SCPreferences.CUSTOM_SETTING, 0);
 */
function useSCPreference<T = any>(preferenceKey: string, defaultValue?: T): T | undefined {
  const {preferences} = useSCPreferences();

  return useMemo(() => {
    if (!preferences || !(preferenceKey in preferences)) {
      return defaultValue;
    }

    const pref = preferences[preferenceKey] as PreferenceValue<T>;
    return pref.value;
  }, [preferences, preferenceKey, defaultValue]);
}

/**
 * Custom hook to check if a given preference is present and has a value.
 * @param preferenceKey - full preference key (e.g., 'section.name')
 * @param defaultValue - default returned value (default=false)
 * @returns boolean
 *
 * Ex.
 * const isEnabled = useSCPreferenceEnabled(SCPreferences.CONFIGURATIONS_CONNECTION_ENABLED);
 **/
function useSCPreferenceEnabled(preferenceKey: string, defaultValue = false): boolean {
  const value = useSCPreference<boolean>(preferenceKey, defaultValue);
  return value ?? defaultValue;
}

/**
 * Custom hook to check if all specified preferences are enabled
 * @param preferenceKeys - Array of preference keys to check
 * @param defaultValue - Default value if a preference doesn't exist
 * @returns boolean - true if all preferences are enabled
 *
 * Ex.
 * const arePreferencesEnabled = useSCPreferencesEnabled([
 *   SCPreferences.CONFIGURATIONS_POST_USER_ADDRESSING_ENABLED,
 *   SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED
 * ]);
 */
function useSCPreferencesEnabled(preferenceKeys: string[], defaultValue = false): boolean {
  const {preferences} = useSCPreferences();

  return useMemo(() => {
    // Se non ci sono preferences o non è stato passato nessun preferenceKey, ritorna il valore di default
    if (!preferences || !preferenceKeys.length) {
      return defaultValue;
    }

    // Verifica che tutte le preferenze siano presenti e abbiano value = true
    return preferenceKeys.every((key) => {
      if (!(key in preferences)) {
        return defaultValue;
      }
      return preferences[key].value;
    });
  }, [preferences, preferenceKeys, defaultValue]);
}

export {useSCPreferenceEnabled, useSCPreferencesEnabled};
export default useSCPreference;
