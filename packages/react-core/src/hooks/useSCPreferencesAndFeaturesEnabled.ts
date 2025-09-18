import {useMemo} from 'react';
import {SCFeatureName} from '@selfcommunity/types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';

/**
 * Custom hook preferences and features at the same time
 * @param preferences - array of preference keys
 * @param features - array of feature keys
 * @returns boolean - true only if all preferences and features are enabled
 *
 * Ex.
 * const isEnabled = useSCPreferencesAndFeaturesEnabled(
 *     [
 *       SCPreferences.CONFIGURATIONS_POST_USER_ADDRESSING_ENABLED,
 *       SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED
 *     ],
 *     [SCFeatureName.TAGGING]
 *   );
 */
export default function useSCPreferencesAndFeaturesEnabled(preferences: string[], features: SCFeatureName[] = []): boolean {
  const {preferences: preferencesContext, features: featuresContext} = useSCPreferences();

  return useMemo(() => {
    // Check available context
    if (!preferencesContext || !featuresContext) {
      return false;
    }

    // Check every preferences
    const preferencesEnabled = preferences.every((key) => key in preferencesContext && preferencesContext[key].value);

    // Check every features
    const featuresEnabled = features.every((feature) => featuresContext.includes(feature));

    // Return true only if all preferences and features are enabled
    return preferencesEnabled && featuresEnabled;
  }, [preferencesContext, featuresContext, preferences, features]);
}
