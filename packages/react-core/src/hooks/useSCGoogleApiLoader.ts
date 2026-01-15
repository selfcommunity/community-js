import {useMemo} from 'react';
import {useApiIsLoaded, useApiLoadingStatus, useMapsLibrary} from '@vis.gl/react-google-maps';
import {SCPreferencesContextType} from '../types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import * as SCPreferences from '../constants/Preferences';

const useSCGoogleApiLoader = () => {
  const {preferences}: SCPreferencesContextType = useSCPreferences();
  const isLoaded = useApiIsLoaded();
  const status = useApiLoadingStatus();
  const placesLibrary = useMapsLibrary('places');

  const libraries = ['places', 'geocoding', 'maps'];

  const geocodingApiKey = useMemo(() => {
    return preferences && SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY in preferences
      ? preferences[SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY].value
      : null;
  }, [preferences]);

  return {isLoaded, status, geocodingApiKey, libraries, placesLibrary};
};

export default useSCGoogleApiLoader;
