import {useMemo} from 'react';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';

/**
 * Custom hook to check if a given preference is present and has a value.
 * @param preference - full preference key (e.g., 'section.name')
 * @returns boolean - true if the preference exists and has a value
 */
export default function useSCPreferenceEnabled(preference: string): boolean {
  const {preferences} = useSCPreferences();

  return useMemo(() => {
    return preferences && preference in preferences && preferences[preference].value;
  }, [preferences, preference]);
}
