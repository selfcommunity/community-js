import React, {SyntheticEvent, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {Autocomplete, AutocompleteProps} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCContributionLocation, SCLocalityType} from '@selfcommunity/types/src/index';
import {styled} from '@mui/material/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCLocationAutocomplete';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  minWidth: 120
}));

export interface LocationAutocompleteProps
  extends Pick<
    AutocompleteProps<SCContributionLocation, false, false, true>,
    Exclude<
      keyof AutocompleteProps<SCContributionLocation, false, false, true>,
      | 'options'
      | 'getOptionLabel'
      | 'filterOptions'
      | 'autoComplete'
      | 'includeInputInList'
      | 'filterSelectedOptions'
      | 'value'
      | 'selectOnFocus'
      | 'handleHomeEndKeys'
      | 'noOptionsText'
      | 'onChange'
      | 'onInputChange'
      | 'isOptionEqualToValue'
      | 'renderInput'
      | 'renderOption'
    >
  > {
  /**
   * The props applied to the text field.
   * @default {variant: 'outlined, label: location_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Callback for change event on poll object
   * @param value
   * @default null
   */
  onChange?: (value: any) => void;
}
/**
 * > API documentation for the Community-JS Location Autocomplete component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a bar that allows users to search (with autocomplete) for cities names.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/LocationAutocomplete)
 *
 * #### Import
 *  ```jsx
 *  import {LocationAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCLocationAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCLocationAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function LocationAutocomplete(inProps: LocationAutocompleteProps): JSX.Element {
  // Props
  const props: LocationAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    defaultValue = null,
    disabled = false,
    onChange,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.locationAutocomplete.label" defaultMessage="ui.composer.locations.label" />
    },
    ...rest
  } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [value, setValue] = useState<string | SCContributionLocation>(defaultValue);
  const [search, setSearch] = useState<string>('');

  const load = (offset = 0, limit = 20) => {
    http
      .request({
        url: Endpoints.ComposerLocalitySearch.url(),
        method: Endpoints.ComposerLocalitySearch.method,
        params: {
          offset,
          limit,
          search: search.trim()
        }
      })
      .then((res: HttpResponse<any>) => {
        setLocations(res.data.results);
      })
      .then(() => setIsLoading(false));
  };

  // Component update
  useEffect(() => {
    if (!isLoading && search.trim().length > 0) {
      load();
    }
  }, [search]);

  useEffect(() => {
    if (value) {
      onChange && onChange(value);
    }
  }, [value]);

  // Handlers

  const handleChange = (event: SyntheticEvent, value: SCLocalityType) => {
    setValue(value ? {location: value.full_address, lat: value.lat, lng: value.lng} : null);
    onChange && onChange(value);
  };

  const handleSearch = (event: SyntheticEvent, _search: string) => {
    setSearch(_search);
  };

  // Render
  const options = useMemo(() => {
    if (!value || typeof value === 'string' || locations.find((loc: SCLocalityType) => value.lat === loc.lat && value.lng === loc.lng)) {
      return locations;
    }
    return [...locations, {lat: value.lat, lng: value.lng, full_address: value.location}];
  }, [value, locations]);

  return (
    <Root
      className={classes.root}
      options={options || []}
      // @ts-ignore
      getOptionLabel={(option: SCLocalityType | SCContributionLocation) => option?.full_address || option?.location || ''}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      value={value || null}
      selectOnFocus
      handleHomeEndKeys
      disabled={disabled}
      noOptionsText={<FormattedMessage id="ui.locationAutocomplete.empty" defaultMessage="ui.locationAutocomplete.empty" />}
      onChange={handleChange}
      onInputChange={handleSearch}
      isOptionEqualToValue={(option: SCLocalityType, value: SCContributionLocation) => value.lat === option.lat && value.lng === option.lng}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...TextFieldProps}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              autoComplete: 'location', // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        );
      }}
      renderOption={(props, option: SCLocalityType, {inputValue}) => {
        const matches = match(option.full_address, inputValue);
        const parts = parse(option.full_address, matches);
        return (
          <li key={`${option.lat}_${option.lng}`} {...props} style={{whiteSpace: 'break-spaces'}}>
            {parts.map((part, index) =>
              part.highlight ? (
                <span key={index} style={{fontWeight: 700}}>
                  {part.text}
                </span>
              ) : (
                part.text
              )
            )}
          </li>
        );
      }}
      {...rest}
    />
  );
}
