import {useMemo} from 'react';
import {SCFeatureName} from '@selfcommunity/types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';

/**
 * Custom hook to check if the feature is enabled
 * @param featureName - feature name
 * @returns boolean - true if the feature is in the list of features
 *
 * Ex.
 *   const isTaggingEnabled = useSCFeatureEnabled(SCFeatureName.TAGGING);
 */
export function useSCFeatureEnabled(featureName: SCFeatureName): boolean {
  const {features} = useSCPreferences();

  return useMemo(() => {
    return Boolean(features && features.includes(featureName));
  }, [features, featureName]);
}

/**
 * Custom hook to check if a list of features are enabled
 * @param featureNames - feature names
 * @returns boolean - true if all features are in the features list
 *
 * Ex.
 *   const hasRequiredFeatures = useSCFeaturesEnabled([
 *     SCFeatureName.TAGGING,
 *     SCFeatureName.GROUPING
 *   ]);
 */
export function useSCFeaturesEnabled(featureNames: SCFeatureName[]): boolean {
  const {features} = useSCPreferences();

  return useMemo(() => {
    return Boolean(features && featureNames.every((name) => features.includes(name)));
  }, [features, featureNames]);
}
