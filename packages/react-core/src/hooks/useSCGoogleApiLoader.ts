import {useMemo} from 'react';
import {useLoadScript, Libraries} from '@react-google-maps/api';
import {SCPreferencesContextType} from '../types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import * as SCPreferences from '../constants/Preferences';

const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'geocoding', 'maps'];

const useSCGoogleApiLoader = () => {
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  const geocodingApiKey = useMemo(() => {
    return preferences && SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY in preferences
      ? preferences[SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY].value
      : null;
  }, [preferences]);

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: geocodingApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return {isLoaded, loadError, geocodingApiKey};
};

export default useSCGoogleApiLoader;
