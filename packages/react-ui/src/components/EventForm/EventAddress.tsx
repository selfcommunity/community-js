import {Autocomplete, Box, InputAdornment, Tab, Tabs, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {useLoadScript} from '@react-google-maps/api';
import {SCEventLocationType, SCEventType} from '@selfcommunity/types';
import axios from 'axios';
import classNames from 'classnames';
import {ChangeEvent, SyntheticEvent, useEffect, useMemo, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import UrlTextField from '../../shared/UrlTextField';
import {PREFIX} from './constants';
import {Geolocation, Place} from './types';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';

const messages = defineMessages({
  virtualPlaceholder: {
    id: 'ui.eventForm.address.online.placeholder',
    defaultMessage: 'ui.eventForm.address.online.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-event-address-root`,
  tabs: `${PREFIX}-event-address-tabs`,
  tab: `${PREFIX}-event-address-tab`,
  tabContent: `${PREFIX}-event-address-tab-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'EventAddressRoot'
})(() => ({}));

export interface EventAddressProps {
  event?: SCEventType;
  forwardGeolocationData: (data: Geolocation) => void;
  className?: string;
}

export default function EventAddress(inProps: EventAddressProps): JSX.Element {
  //PROPS
  const props: EventAddressProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // INTL
  const intl = useIntl();
  // PROPS
  const {className, forwardGeolocationData, event} = props;

  // STATE
  const [location, setLocation] = useState<SCEventLocationType>(event?.location || SCEventLocationType.PERSON);
  const [geolocation, setGeoLocation] = useState<Place | null>(event ? {description: event.geolocation} : null);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // PREFERENCES
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  // MEMO
  const geocodingApiKey = useMemo(() => {
    return preferences && SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY in preferences
      ? preferences[SCPreferences.PROVIDERS_GOOGLE_GEOCODING_API_KEY].value
      : null;
  }, [preferences]);

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: geocodingApiKey,
    libraries: ['places', 'geocoding']
  });

  // HANDLERS
  const handleChange = (_event: SyntheticEvent, newValue: SCEventLocationType) => {
    setLocation(newValue);
  };

  const handleSelection = async (_event: SyntheticEvent, newValue: Place) => {
    if (newValue) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            place_id: newValue.id,
            key: geocodingApiKey
          }
        });

        const place = response.data.results[0];
        setGeoLocation(newValue);
        forwardGeolocationData({
          location,
          geolocation: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        });
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  };

  const handleLocationChange = (_event: SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    forwardGeolocationData({location, link: event.target.value});
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (inputValue === '') {
      setSuggestions([]);
      return;
    }

    if (inputValue.length >= 3) {
      const newTimeoutId = setTimeout(() => {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({input: inputValue}, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(
              predictions.map((prediction) => ({
                description: prediction.description,
                id: prediction.place_id
              }))
            );
          }
        });
      }, 300);

      setTimeoutId(newTimeoutId);
    }
  }, [inputValue]);

  if (!geocodingApiKey && !isLoaded) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      <Tabs className={classes.tabs} value={location} onChange={handleChange} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
        <Tab
          value={SCEventLocationType.PERSON}
          classes={{root: classes.tab}}
          icon={<Icon>add_location_alt</Icon>}
          iconPosition="start"
          label={<FormattedMessage id="ui.eventForm.address.live.label" defaultMessage="ui.eventForm.address.live.label" />}
        />
        <Tab
          value={SCEventLocationType.ONLINE}
          classes={{root: classes.tab}}
          icon={<Icon>play_circle_outline</Icon>}
          iconPosition="start"
          label={<FormattedMessage id="ui.eventForm.address.online.label" defaultMessage="ui.eventForm.address.online.label" />}
        />
      </Tabs>
      <Box className={classes.tabContent}>
        {location === SCEventLocationType.PERSON && (
          <Autocomplete
            disabled={!geocodingApiKey}
            size="small"
            value={geolocation}
            onChange={handleSelection}
            inputValue={inputValue}
            onInputChange={handleLocationChange}
            options={suggestions}
            getOptionLabel={(option) => option.description || geolocation.description}
            noOptionsText={<FormattedMessage id="ui.eventForm.address.live.noResults" defaultMessage="ui.eventForm.address.live.noResults" />}
            isOptionEqualToValue={(option: Place, value: Place) => option.description === value.description}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<FormattedMessage id="ui.eventForm.address.live.placeholder" defaultMessage="ui.eventForm.address.live.placeholder" />}
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Icon>add_location_alt</Icon>
                      </InputAdornment>
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        )}
        {location === SCEventLocationType.ONLINE && (
          <UrlTextField
            size="small"
            fullWidth
            type="url"
            placeholder={`${intl.formatMessage(messages.virtualPlaceholder)}`}
            helperText={<FormattedMessage id="ui.eventForm.address.online.help" defaultMessage="ui.eventForm.address.online.help" />}
            InputProps={{
              endAdornment: <Icon>play_circle_outline</Icon>
            }}
            onChange={handleLinkChange}
          />
        )}
      </Box>
    </Root>
  );
}
