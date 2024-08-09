import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Autocomplete, Box, InputAdornment, Tab, Tabs, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import UrlTextField from '../../shared/UrlTextField';
import axios from 'axios';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {SCEventLocationType} from '@selfcommunity/types';
import {useLoadScript} from '@react-google-maps/api';

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
  forwardGeolocationData: (data: {location: SCEventLocationType; geolocation?: string; lat?: number; lng?: number; link?: string}) => void;
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
  const {className, forwardGeolocationData} = props;

  // STATE
  const [location, setLocation] = useState<SCEventLocationType>(SCEventLocationType.PERSON);
  const [geolocation, setGeoLocation] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const geocodingApiKey = useMemo(
    () => scContext.settings.integrations && scContext.settings.integrations.geocoding.apiKey,
    [scContext.settings.integrations]
  );
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: scContext.settings.integrations.geocoding.apiKey,
    libraries: ['places', 'geocoding']
  });

  // HANDLERS
  const handleChange = (event: React.SyntheticEvent, newValue: SCEventLocationType) => {
    setLocation(newValue);
  };

  const handleSelection = async (event, newValue) => {
    if (newValue) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            place_id: newValue.place_id,
            key: geocodingApiKey
          }
        });

        const place = response.data.results[0];
        setGeoLocation(newValue);
        forwardGeolocationData({
          location: location,
          geolocation: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        });
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  };

  const handleLocationChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleLinkChange = (event) => {
    forwardGeolocationData({location: location, link: event.target.value});
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
      const newTimeoutId = window.setTimeout(() => {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({input: inputValue}, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(
              predictions.map((prediction) => ({
                description: prediction.description,
                place_id: prediction.place_id
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
            freeSolo
            size="small"
            value={geolocation}
            onChange={handleSelection}
            inputValue={inputValue}
            onInputChange={handleLocationChange}
            options={suggestions}
            getOptionLabel={(option) => option.description}
            noOptionsText={<FormattedMessage id="ui.eventForm.address.live.noResults" defaultMessage="ui.eventForm.address.live.noResults" />}
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
