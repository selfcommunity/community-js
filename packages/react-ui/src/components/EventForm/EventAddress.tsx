import React, {useMemo, useState} from 'react';
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

const messages = defineMessages({
  virtualPlaceholder: {
    id: 'ui.eventForm.address.virtual.placeholder',
    defaultMessage: 'ui.eventForm.address.virtual.placeholder'
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

export enum AddressType {
  PERSON = 'person',
  VIRTUAL = 'virtual'
}

export interface EventAddressProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

/**
 * > API documentation for the Community-JS Change Group Cover component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a button that allows admins to edit the group cover and a popover that specifies format and sizes allowed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/EventAddress)

 #### Import
 ```jsx
 import {EventAddress} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCUploadEventCover` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventForm-event-address-root|Styles applied to the root element.|

 * @param inProps
 */
export default function EventAddress(inProps: EventAddressProps): JSX.Element {
  //PROPS
  const props: EventAddressProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // INTL
  const intl = useIntl();
  // PROPS
  const {className} = props;

  // STATE
  const [tab, setTab] = useState(AddressType.PERSON);
  const [location, setLocation] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const geocodingApiKey = useMemo(
    () => scContext.settings.integrations && scContext.settings.integrations.geocoding.apiKey,
    [scContext.settings.integrations]
  );

  // HANDLERS
  const handleChange = (event: React.SyntheticEvent, newValue: AddressType) => {
    setTab(newValue);
  };

  const handleLocationChange = async (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue) {
      const suggestions = await getLocationSuggestion(newInputValue);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getLocationSuggestion = async (inputValue) => {
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete`, {
        params: {
          text: inputValue,
          apiKey: geocodingApiKey
        }
      });

      return response.data.features.map((feature) => ({
        label: feature.properties.formatted,
        value: feature.properties
      }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  if (!geocodingApiKey) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      <Tabs className={classes.tabs} value={tab} onChange={handleChange} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
        <Tab
          value={AddressType.PERSON}
          classes={{root: classes.tab}}
          icon={<Icon>add_location_alt</Icon>}
          iconPosition="start"
          label={<FormattedMessage id="ui.eventForm.address.live.label" defaultMessage="ui.eventForm.address.live.label" />}
        />
        <Tab
          value={AddressType.VIRTUAL}
          classes={{root: classes.tab}}
          icon={<Icon>play_circle_outline</Icon>}
          iconPosition="start"
          label={<FormattedMessage id="ui.eventForm.address.virtual.label" defaultMessage="ui.eventForm.address.virtual.label" />}
        />
      </Tabs>
      <Box className={classes.tabContent}>
        {tab === AddressType.PERSON && (
          <Autocomplete
            freeSolo
            size="small"
            value={location}
            onChange={(event, newValue) => {
              setLocation(newValue);
            }}
            inputValue={inputValue}
            onInputChange={handleLocationChange}
            options={suggestions}
            getOptionLabel={(option) => option.label}
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
        {tab === AddressType.VIRTUAL && (
          <UrlTextField
            size="small"
            fullWidth
            type="url"
            placeholder={`${intl.formatMessage(messages.virtualPlaceholder)}`}
            helperText={<FormattedMessage id="ui.eventForm.address.virtual.help" defaultMessage="ui.eventForm.address.virtual.help" />}
            InputProps={{
              endAdornment: <Icon>play_circle_outline</Icon>
            }}
          />
        )}
      </Box>
    </Root>
  );
}
